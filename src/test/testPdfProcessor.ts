// Simple test to verify PDF processing works
import { pdfProcessor } from '../utils/pdfProcessor';

export const testPdfProcessing = () => {
  console.log('Testing PDF processor...');
  
  // Test the question parsing with sample text matching your format
  const sampleText = `
SRI KRISHNA INSTITUTE OF TECHNOLOGY
Department of Artificial Intelligence and Machine Learning
Subject Name: Analysis and Design of Algorithms Subject Code: BCS401
SEM: 4th DIV: A
Faculty: Prof. Manzoor Ahmed
Module-1 Question Bank

SL# Question CO Level Marks
1. Define algorithm. Explain asymptotic notations Big Oh, Big Omega and Big Theta notations. Derive the efficiency of recursive algorithm. Suggest a recursive algorithm to find factorial of number. Derive its efficiency. CO1 L2 08
2. Explain the general plan for analyzing the efficiency of recursive algorithm. Suggest a recursive algorithm to find factorial of number. Derive its efficiency. CO1 L2 08
3. Explain general plan of mathematical analysis of non-recursive algorithms. Design the algorithm to find the efficiency of bubble sort. CO1 L2 08
4. Problem and obtain the time efficiency. If f(n) ∈ O(g1(n)) and g(n) ∈ O(g2(n)), then show that f1(n) + g1(n) ∈ O(max{g1(n), g2(n)}). CO1 L2 04
5. With neat diagram explain different steps in designing and analyzing an algorithm. CO1 L2 08
6. Explain the general plan for analyzing the efficiency of a non-recursive algorithm. Suggest a non-recursive algorithm to find maximum element in the list of numbers. Derive the efficiency. With the algorithm derive the worst case efficiency for Bubble sort. CO1 L2 08
7. What is an algorithm? Explain the fundamentals of algorithmic problem solving. CO1 L2 04
8. Develop an algorithm to search an element in an array using sequential search. Calculate the best case, worst case and average case efficiency of this algorithm. CO1 L2 10
9. Explain asymptotic notations with example. CO1 L2 10
10. Give the general plan for analyzing the efficiency of the recursive algorithm. Develop recursive algorithm for computing factorial of a positive number. Calculate the efficiency in terms of order of growth. CO1 L2 10
11. For each of the following functions, indicate how much the functions value will change if its argument is increased fourfold. CO1 L1 05
12. For each of the following pairs of functions, indicate whether the first function of each of the following pairs has a lower, same, or higher order of growth (to within a constant multiple) than the second function. CO1 L1 05
  `;
  
  try {
    console.log('Sample text:', sampleText);
    
    const extractedQuestions = pdfProcessor.parseQuestions(sampleText);
    console.log('Extracted questions:', extractedQuestions);
    
    const questions = pdfProcessor.convertToQuestions(extractedQuestions);
    console.log('Converted questions:', questions);
    
    return questions;
  } catch (error) {
    console.error('Test failed:', error);
    return [];
  }
};

// Test function that can be called from browser console
(window as any).testPdfProcessing = testPdfProcessing;
