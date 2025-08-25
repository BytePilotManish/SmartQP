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
      // Validate file type
      if (!file.type.includes('pdf') && !file.name.toLowerCase().endsWith('.pdf')) {
        throw new Error('Please upload a valid PDF file.');
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('PDF file is too large. Please upload a file smaller than 10MB.');
      }

      console.log('Converting file to array buffer...');
      const arrayBuffer = await file.arrayBuffer();
      console.log('Array buffer size:', arrayBuffer.byteLength);

      console.log('Loading PDF document...');
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      console.log('PDF loaded, pages:', pdf.numPages);
      
      let fullText = '';
      
      // Extract text from all pages
      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const textContent = await page.getTextContent();
        
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
      }
      
      return fullText;
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      throw new Error('Failed to extract text from PDF. Please ensure the file is a valid PDF.');
    }
  }



  /**
   * Parse questions from extracted text based on the table format
   */
  parseQuestions(text: string): ExtractedQuestion[] {
    const questions: ExtractedQuestion[] = [];

    try {
      // Split text into lines and clean them
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);

      // Find the start of the question table - look for table headers
      let questionStartIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].toLowerCase();
        if ((line.includes('sl#') || line.includes('s.no') || line.includes('question')) &&
            (line.includes('co') || line.includes('level') || line.includes('marks'))) {
          questionStartIndex = i + 1; // Start from next line after header
          break;
        }
      }

      // Alternative: Look for numbered questions
      if (questionStartIndex === -1) {
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].match(/^\d+\.?\s+[A-Za-z]/)) {
            questionStartIndex = i;
            break;
          }
        }
      }

      if (questionStartIndex === -1) {
        // Try to find any line that starts with a number followed by text
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].match(/^\d+/)) {
            questionStartIndex = i;
            break;
          }
        }
      }

      if (questionStartIndex === -1) {
        throw new Error('Could not find question table in the PDF. Please ensure the PDF contains a properly formatted question table.');
      }

      // Parse each question row
      let currentQuestion: Partial<ExtractedQuestion> | null = null;

      for (let i = questionStartIndex; i < lines.length; i++) {
        const line = lines[i];

        // Skip empty lines and obvious headers
        if (!line || this.isHeaderLine(line)) {
          continue;
        }

        // Check if this line starts a new question (begins with number)
        const questionMatch = line.match(/^(\d+)\.?\s+(.+)/);
        if (questionMatch) {
          // Save previous question if exists
          if (currentQuestion && currentQuestion.text) {
            questions.push(this.finalizeQuestion(currentQuestion));
          }

          // Start new question
          currentQuestion = {
            serialNumber: questionMatch[1],
            text: questionMatch[2],
            co: '',
            level: '',
            marks: 0
          };

          // Try to extract CO, Level, Marks from the same line
          this.extractMetadata(currentQuestion, line);
        } else if (currentQuestion) {
          // This might be a continuation of the current question or metadata
          if (line.match(/^(CO|L)\d+/i) || line.match(/^\d+$/)) {
            // This line contains metadata
            this.extractMetadata(currentQuestion, line);
          } else if (currentQuestion.text && line.length > 5) {
            // This might be continuation of question text
            currentQuestion.text += ' ' + line;
          }
        }
      }

      // Don't forget the last question
      if (currentQuestion && currentQuestion.text) {
        questions.push(this.finalizeQuestion(currentQuestion));
      }

      return questions;
    } catch (error) {
      console.error('Error parsing questions:', error);
      throw new Error('Failed to parse questions from PDF. Please check the format.');
    }
  }

  /**
   * Check if a line is a header line that should be skipped
   */
  private isHeaderLine(line: string): boolean {
    const lowerLine = line.toLowerCase();
    return lowerLine.includes('question') &&
           (lowerLine.includes('sl#') || lowerLine.includes('s.no') ||
            lowerLine.includes('co') || lowerLine.includes('level') ||
            lowerLine.includes('marks'));
  }

  /**
   * Extract metadata (CO, Level, Marks) from a line
   */
  private extractMetadata(question: Partial<ExtractedQuestion>, line: string): void {
    // Extract CO
    const coMatch = line.match(/CO(\d+)/i);
    if (coMatch && !question.co) {
      question.co = coMatch[1];
    }

    // Extract Level
    const levelMatch = line.match(/L(\d+)/i);
    if (levelMatch && !question.level) {
      question.level = levelMatch[1];
    }

    // Extract Marks (look for standalone numbers or numbers at end)
    const marksMatch = line.match(/(\d+)\s*$/);
    if (marksMatch && !question.marks) {
      const marks = parseInt(marksMatch[1]);
      // Only consider reasonable mark values (typically 1-50)
      if (marks >= 1 && marks <= 50) {
        question.marks = marks;
      }
    }

    // Clean the question text if metadata was found in it
    if (question.text && (coMatch || levelMatch || marksMatch)) {
      question.text = question.text
        .replace(/CO\d+/gi, '')
        .replace(/L\d+/gi, '')
        .replace(/\d+\s*$/, '')
        .trim();
    }
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
    const coNum = parseInt(co);
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
    const levelNum = parseInt(level);
    if (levelNum <= 1) return 'easy';
    if (levelNum <= 2) return 'medium';
    return 'hard';
  }
}

export const pdfProcessor = PDFProcessor.getInstance();
