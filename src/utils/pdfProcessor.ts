import { Question } from '../types';
import * as pdfjsLib from 'pdfjs-dist';

// Set up the worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export interface ExtractedQuestion {
  serialNumber: string;
  text: string;
  co: string;
  level: string;
  marks: number;
  module?: number;
}

export class PDFProcessor {
  private static instance: PDFProcessor;
  
  public static getInstance(): PDFProcessor {
    if (!PDFProcessor.instance) {
      PDFProcessor.instance = new PDFProcessor();
    }
    return PDFProcessor.instance;
  }

  /**
   * Extract text from PDF file
   */
  async extractTextFromPDF(file: File): Promise<string> {
    try {
      console.log('PDFProcessor: Starting PDF text extraction...');
      
      // Validate file type
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Please upload a valid PDF file.');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('PDF file is too large. Please upload a file smaller than 10MB.');
      }

      console.log('PDFProcessor: Converting file to array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('PDFProcessor: Array buffer size:', arrayBuffer.byteLength);

      console.log('PDFProcessor: Loading PDF document...');
      const loadingTask = pdfjsLib.getDocument({ 
        data: arrayBuffer,
        verbosity: 0 // Reduce console noise
      });
      
      const pdf = await loadingTask.promise;
      console.log('PDFProcessor: PDF loaded successfully, pages:', pdf.numPages);
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        console.log(`PDFProcessor: Processing page ${pageNum}/${pdf.numPages}`);
        
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        // Extract text items and preserve some structure
        const pageText = textContent.items
          .map((item: any) => {
            // Add space after each text item to prevent words from joining
            return item.str + ' ';
          })
          .join('');
        
        fullText += pageText + '\n';
      }
      
      console.log('PDFProcessor: Text extraction completed. Total length:', fullText.length);
      console.log('PDFProcessor: First 1000 characters:', fullText.substring(0, 1000));
      
      return fullText;
    } catch (error) {
      console.error('PDFProcessor: Error extracting text from PDF:', error);
      throw new Error(`Failed to extract text from PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse questions from extracted text based on the table format
   */
  parseQuestions(text: string): ExtractedQuestion[] {
    const questions: ExtractedQuestion[] = [];

    try {
      console.log('PDFProcessor: Starting question parsing...');
      console.log('PDFProcessor: Input text length:', text.length);

      // Clean and normalize the text
      const cleanText = text
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .replace(/\s+/g, ' ')
        .trim();

      console.log('PDFProcessor: Cleaned text length:', cleanText.length);

      // Split into lines and clean them
      const lines = cleanText.split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);

      console.log('PDFProcessor: Total lines:', lines.length);

      // Look for question patterns - more flexible approach
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Skip obvious header lines
        if (this.isHeaderLine(line)) {
          console.log('PDFProcessor: Skipping header line:', line);
          continue;
        }

        // Look for lines that start with a number followed by a dot
        const questionMatch = line.match(/^(\d+)\.\s*(.+)/);
        if (questionMatch) {
          const serialNumber = questionMatch[1];
          let questionText = questionMatch[2];
          
          console.log(`PDFProcessor: Found question ${serialNumber}:`, questionText.substring(0, 100));

          // Initialize question object
          const question: Partial<ExtractedQuestion> = {
            serialNumber,
            text: questionText,
            co: '',
            level: '',
            marks: 0
          };

          // Try to extract metadata from the same line or subsequent lines
          let searchText = line;
          let nextLineIndex = i + 1;
          
          // Look ahead a few lines for metadata if not found in current line
          while (nextLineIndex < lines.length && nextLineIndex < i + 3) {
            const nextLine = lines[nextLineIndex];
            if (nextLine && !nextLine.match(/^\d+\./)) {
              searchText += ' ' + nextLine;
              nextLineIndex++;
            } else {
              break;
            }
          }

          // Extract metadata from the combined text
          this.extractMetadata(question, searchText);

          // Clean up the question text by removing metadata
          question.text = this.cleanQuestionText(question.text || '');

          // Finalize and add the question
          if (question.text && question.text.length > 10) {
            questions.push(this.finalizeQuestion(question));
          }
        }
      }

      console.log('PDFProcessor: Parsing completed. Found questions:', questions.length);
      
      if (questions.length === 0) {
        // Try alternative parsing method
        console.log('PDFProcessor: No questions found with primary method, trying alternative...');
        return this.parseQuestionsAlternative(text);
      }

      return questions;
    } catch (error) {
      console.error('PDFProcessor: Error parsing questions:', error);
      throw new Error('Failed to parse questions from PDF. Please check the format.');
    }
  }

  /**
   * Alternative parsing method for different PDF formats
   */
  private parseQuestionsAlternative(text: string): ExtractedQuestion[] {
    const questions: ExtractedQuestion[] = [];
    
    try {
      console.log('PDFProcessor: Using alternative parsing method...');
      
      // Look for any numbered items in the text
      const questionRegex = /(\d+)[\.\)]\s*([^0-9]+?)(?=\d+[\.\)]|$)/g;
      let match;
      
      while ((match = questionRegex.exec(text)) !== null) {
        const serialNumber = match[1];
        const questionText = match[2].trim();
        
        if (questionText.length > 20) { // Only consider substantial text
          console.log(`PDFProcessor: Alternative method found question ${serialNumber}`);
          
          const question: Partial<ExtractedQuestion> = {
            serialNumber,
            text: questionText,
            co: '',
            level: '',
            marks: 0
          };

          this.extractMetadata(question, questionText);
          question.text = this.cleanQuestionText(question.text || '');

          if (question.text.length > 10) {
            questions.push(this.finalizeQuestion(question));
          }
        }
      }

      console.log('PDFProcessor: Alternative parsing found questions:', questions.length);
      return questions;
    } catch (error) {
      console.error('PDFProcessor: Alternative parsing failed:', error);
      return [];
    }
  }

  /**
   * Check if a line is a header line that should be skipped
   */
  private isHeaderLine(line: string): boolean {
    const lowerLine = line.toLowerCase();
    
    // Skip lines that contain table headers
    const headerKeywords = [
      'sl#', 's.no', 'serial', 'question', 'co', 'level', 'marks', 'subject',
      'department', 'faculty', 'module', 'sem', 'div', 'institute', 'technology'
    ];
    
    let keywordCount = 0;
    for (const keyword of headerKeywords) {
      if (lowerLine.includes(keyword)) {
        keywordCount++;
      }
    }
    
    // If line contains multiple header keywords, it's likely a header
    return keywordCount >= 2;
  }

  /**
   * Extract metadata (CO, Level, Marks) from a line
   */
  private extractMetadata(question: Partial<ExtractedQuestion>, text: string): void {
    // Extract CO (Course Outcome)
    const coMatch = text.match(/CO\s*(\d+)/i);
    if (coMatch && !question.co) {
      question.co = coMatch[1];
    }

    // Extract Level
    const levelMatch = text.match(/L\s*(\d+)/i);
    if (levelMatch && !question.level) {
      question.level = levelMatch[1];
    }

    // Extract Marks - look for standalone numbers that could be marks
    const marksMatches = text.match(/\b(\d+)\b/g);
    if (marksMatches && !question.marks) {
      // Look for reasonable mark values (typically 1-50)
      for (const match of marksMatches) {
        const marks = parseInt(match);
        if (marks >= 1 && marks <= 50) {
          question.marks = marks;
          break;
        }
      }
    }
  }

  /**
   * Clean question text by removing metadata and extra whitespace
   */
  private cleanQuestionText(text: string): string {
    return text
      .replace(/CO\s*\d+/gi, '') // Remove CO references
      .replace(/L\s*\d+/gi, '')  // Remove Level references
      .replace(/\b\d{1,2}\b\s*$/, '') // Remove trailing numbers (likely marks)
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Finalize a question by ensuring all required fields are present
   */
  private finalizeQuestion(question: Partial<ExtractedQuestion>): ExtractedQuestion {
    return {
      serialNumber: question.serialNumber || '1',
      text: question.text?.trim() || 'Question text not found',
      co: question.co || '1',
      level: question.level || '2',
      marks: question.marks || 8
    };
  }

  /**
   * Convert extracted questions to Question objects
   */
  convertToQuestions(extractedQuestions: ExtractedQuestion[], subject: string = 'Computer Science'): Question[] {
    console.log('PDFProcessor: Converting to Question objects...');
    
    return extractedQuestions.map((eq, index) => ({
      id: `extracted_${index + 1}`,
      text: eq.text,
      module: this.determineModule(eq.co),
      difficulty: this.determineDifficulty(eq.level),
      marks: eq.marks,
      subject,
      createdAt: new Date()
    }));
  }

  /**
   * Determine module based on CO (Course Outcome)
   */
  private determineModule(co: string): number {
    const coNum = parseInt(co) || 1;
    if (coNum <= 2) return 1;
    if (coNum <= 4) return 2;
    if (coNum <= 6) return 3;
    if (coNum <= 8) return 4;
    return 5;
  }

  /**
   * Determine difficulty based on level
   */
  private determineDifficulty(level: string): 'easy' | 'medium' | 'hard' {
    const levelNum = parseInt(level) || 2;
    if (levelNum <= 1) return 'easy';
    if (levelNum <= 2) return 'medium';
    return 'hard';
  }
}

export const pdfProcessor = PDFProcessor.getInstance();