# PDF Question Extraction Guide

## Overview
The SmartQPGen application now supports automatic extraction of questions from PDF files. This feature replaces the previous hardcoded mock questions with real questions parsed from your uploaded PDF documents.

## Supported PDF Format

The application is designed to work with question bank PDFs that follow this table format:

```
| SL# | Question | CO | Level | Marks |
|-----|----------|----| ------|-------|
| 1.  | Define algorithm. Explain asymptotic notations Big Oh, Big Omega and Big Theta notations... | CO1 | L2 | 08 |
| 2.  | Explain the general plan for analyzing the efficiency of recursive algorithm... | CO1 | L2 | 08 |
```

### Required Elements:
- **Serial Number**: Questions should start with a number (1., 2., 3., etc.)
- **Question Text**: The actual question content
- **CO (Course Outcome)**: Format like CO1, CO2, etc.
- **Level**: Format like L1, L2, L3, etc.
- **Marks**: Numeric value (typically 1-50)

## How to Use

### Step 1: Upload PDF
1. Navigate to "New Question Paper" in the sidebar
2. Drag and drop your PDF file or click "Browse Files"
3. Supported file size: Up to 10MB
4. Only PDF files are accepted

### Step 2: Process Questions
1. Click "Generate Questions" button
2. The application will:
   - Extract text from your PDF
   - Parse questions using pattern matching
   - Convert to structured question objects
   - Display processing status with loading indicator

### Step 3: Review and Edit
1. Questions appear in the Question Editor's left pane
2. Each question shows:
   - Module assignment (based on CO)
   - Difficulty level (based on Level)
   - Mark allocation
   - Source file indicator
3. You can edit, delete, or rephrase questions as needed

## Features

### Automatic Processing
- **Text Extraction**: Uses PDF.js library to extract text from PDF files
- **Pattern Recognition**: Identifies question table structure automatically
- **Metadata Parsing**: Extracts CO, Level, and Marks information
- **Module Assignment**: Maps Course Outcomes to modules (CO1-2→Module 1, CO3-4→Module 2, etc.)
- **Difficulty Mapping**: Converts levels to difficulty (L1→Easy, L2→Medium, L3+→Hard)

### Error Handling
- File validation (PDF format, size limits)
- Parsing error recovery with detailed error messages
- Fallback to mock questions if extraction fails
- Toast notifications for success/error feedback

### User Experience
- Loading indicators during processing
- Visual confirmation of extracted questions
- Source file display in question bank
- Real-time question count updates

## Troubleshooting

### Common Issues

**"Could not find question table in the PDF"**
- Ensure your PDF contains a properly formatted question table
- Questions should start with numbers (1., 2., 3., etc.)
- Table should have clear column structure

**"Failed to extract text from PDF"**
- Check if the PDF is not password-protected
- Ensure the PDF contains selectable text (not just images)
- Try with a different PDF file

**"PDF file is too large"**
- Compress your PDF file to under 10MB
- Split large PDFs into smaller sections

**No questions extracted**
- Verify the PDF format matches the expected structure
- Check if questions are clearly numbered
- Ensure text is selectable in the PDF

### Best Practices

1. **PDF Quality**: Use PDFs with clear, selectable text
2. **Table Structure**: Maintain consistent table formatting
3. **Question Numbering**: Use sequential numbering (1., 2., 3., etc.)
4. **Metadata Consistency**: Use consistent CO and Level formats
5. **File Size**: Keep PDFs under 10MB for optimal performance

## Technical Details

### Dependencies
- **PDF.js**: For PDF text extraction
- **Pattern Matching**: Custom regex patterns for question parsing
- **React Context**: For state management across components

### File Structure
- `src/utils/pdfProcessor.ts`: Core PDF processing logic
- `src/contexts/AppContext.tsx`: State management for file processing
- `src/components/pages/NewQuestionPaper.tsx`: File upload interface
- `src/components/pages/QuestionEditor.tsx`: Question display and editing
- `src/components/ui/NotificationToast.tsx`: User feedback system

### Processing Flow
1. File validation and upload
2. PDF.js text extraction
3. Pattern-based question parsing
4. Metadata extraction and mapping
5. Question object creation
6. Context state update
7. UI refresh with extracted questions

## Support

If you encounter issues with PDF extraction:
1. Check the PDF format against the examples above
2. Verify file size and format requirements
3. Try with a different PDF file to isolate the issue
4. Check browser console for detailed error messages
