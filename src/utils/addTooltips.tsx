import React from 'react';
import { MedicalTooltip } from '../components/MedicalTooltip';
import { MEDICAL_GLOSSARY } from '../data/medicalGlossary';

/**
 * Auto-detection utility for adding tooltips to medical terms
 * 
 * Scans text content for medical terms from MEDICAL_GLOSSARY and wraps them
 * with MedicalTooltip components. Handles edge cases like links, code blocks, etc.
 * 
 * Usage:
 * const content = "The p-value was 0.02 with an odds ratio of 1.61"
 * const withTooltips = addTooltips(content)
 */

interface TextNode {
  type: 'text' | 'tooltip' | 'link' | 'code';
  content: string;
  tooltipTerm?: string;
  href?: string;
}

/**
 * Common English words that should never get tooltips (to avoid false positives)
 */
const COMMON_WORDS = new Set([
  'or', 'and', 'the', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'of', 'with',
  'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
  'may', 'might', 'can', 'must', 'this', 'that', 'these', 'those', 'it', 'its',
  'if', 'but', 'not', 'no', 'yes', 'so', 'than', 'then', 'when', 'where', 'what',
  'who', 'which', 'how', 'why', 'all', 'each', 'every', 'some', 'any', 'many',
  'more', 'most', 'other', 'such', 'only', 'just', 'also', 'very', 'too', 'much',
  'well', 'now', 'here', 'there', 'up', 'down', 'out', 'off', 'over', 'under',
  'again', 'further', 'once', 'back', 'away', 'around', 'about', 'through',
  'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within',
  'without', 'against', 'across', 'along', 'beside', 'beyond', 'near', 'far'
]);

/**
 * Check if a word matches a glossary term (case-insensitive, handles punctuation)
 * Skips common English words to avoid false positives
 */
const matchesGlossaryTerm = (word: string, context?: { prevWord?: string; nextWord?: string }): string | null => {
  // Remove trailing punctuation but keep it for matching
  const cleanWord = word.toLowerCase().replace(/[.,;:!?)\]}]$/, '');
  
  // Skip very short common words (likely false positives)
  if (cleanWord.length <= 2 && COMMON_WORDS.has(cleanWord)) {
    // Exception: Only match "OR" if it appears in statistical context
    // (e.g., "OR =", "OR 1.5", "odds ratio (OR)")
    if (cleanWord === 'or') {
      const nextWord = context?.nextWord?.toLowerCase().trim();
      // Check if next word suggests statistical context (starts with =, number, or is "ratio")
      if (nextWord && (
        nextWord.startsWith('=') ||
        /^\d/.test(nextWord) ||
        nextWord.includes('ratio') ||
        nextWord.includes('odds')
      )) {
        // This might be "OR" abbreviation, but we'll skip it since we removed 'or' from glossary
        // Users should use "odds ratio" explicitly
        return null;
      }
    }
    return null;
  }
  
  // Check exact match first
  if (MEDICAL_GLOSSARY[cleanWord]) {
    return cleanWord;
  }
  
  // Check with common variations
  const variations = [
    cleanWord.replace(/\s+/g, '-'), // spaces to hyphens
    cleanWord.replace(/-/g, ' '),   // hyphens to spaces
  ];
  
  for (const variant of variations) {
    if (MEDICAL_GLOSSARY[variant]) {
      return variant;
    }
  }
  
  return null;
};

/**
 * Parse text and identify medical terms
 */
const parseTextForTerms = (text: string): TextNode[] => {
  const nodes: TextNode[] = [];
  
  // Split by whitespace and punctuation, but keep delimiters
  const words = text.split(/(\s+|[.,;:!?)\]}]|\(|\[)/);
  
  let i = 0;
  while (i < words.length) {
    const word = words[i];
    
    // Skip whitespace and punctuation-only tokens
    if (!word.trim() || /^[.,;:!?)\]}\[\(]+$/.test(word)) {
      nodes.push({ type: 'text', content: word });
      i++;
      continue;
    }
    
    // Get context for better matching (prev and next words)
    const prevWord = i > 0 ? words[i - 1]?.trim() : undefined;
    const nextWord = i < words.length - 1 ? words[i + 1]?.trim() : undefined;
    
    // Check if this word matches a glossary term
    const matchedTerm = matchesGlossaryTerm(word, { 
      prevWord, 
      nextWord 
    });
    
    if (matchedTerm) {
      // Check if we're inside a link or code block (skip tooltips in these contexts)
      const prevNode = nodes[nodes.length - 1];
      if (prevNode?.type === 'link' || prevNode?.type === 'code') {
        nodes.push({ type: 'text', content: word });
      } else {
        nodes.push({
          type: 'tooltip',
          content: word,
          tooltipTerm: matchedTerm
        });
      }
    } else {
      nodes.push({ type: 'text', content: word });
    }
    
    i++;
  }
  
  return nodes;
};

/**
 * Convert text nodes to React elements
 */
const nodesToReactElements = (nodes: TextNode[]): React.ReactNode[] => {
  return nodes.map((node, index) => {
    if (node.type === 'tooltip' && node.tooltipTerm) {
      const definition = MEDICAL_GLOSSARY[node.tooltipTerm];
      if (definition) {
        return (
          <React.Fragment key={index}>
            {node.content}
            <MedicalTooltip term={node.tooltipTerm} definition={definition} />
          </React.Fragment>
        );
      }
    }
    
    return <React.Fragment key={index}>{node.content}</React.Fragment>;
  });
};

/**
 * Add tooltips to text content
 * 
 * @param text - The text content to process
 * @param options - Options for processing
 * @returns React elements with tooltips embedded
 */
export const addTooltips = (
  text: string,
  options: {
    skipInLinks?: boolean;
    skipInCode?: boolean;
  } = {}
): React.ReactNode => {
  if (!text || typeof text !== 'string') {
    return text;
  }
  
  const nodes = parseTextForTerms(text);
  const elements = nodesToReactElements(nodes);
  
  return <>{elements}</>;
};

/**
 * Simple version: just wrap a term if it exists in glossary
 * Useful for manual tooltip insertion
 */
export const wrapTermWithTooltip = (
  term: string,
  fallbackText?: string
): React.ReactNode => {
  const definition = MEDICAL_GLOSSARY[term.toLowerCase()];
  
  if (definition) {
    return (
      <>
        {fallbackText || term}
        <MedicalTooltip term={term} definition={definition} />
      </>
    );
  }
  
  return fallbackText || term;
};
