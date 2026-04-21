/**
 * File Parser Module
 *
 * Handles parsing of uploaded files (.txt, .docx, .pdf)
 * Extracts text content for AI detection
 */

import { UploadedFile } from './types';

// Buffer type for handling binary data
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type BufferLike = any;

/**
 * Parse a .txt file - direct text extraction
 */
async function parseTxtFile(buffer: BufferLike): Promise<string> {
  const decoder = new TextDecoder('utf-8');
  return decoder.decode(buffer);
}

/**
 * Parse a .docx file using mammoth.js
 * Extracts text content from Word documents
 */
async function parseDocxFile(buffer: BufferLike): Promise<string> {
  // mammoth is loaded dynamically to avoid issues with Next.js server components
  const mammoth = await import('mammoth');
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}

/**
 * Parse a .pdf file using pdf-parse
 * Extracts text content from PDF documents
 */
async function parsePdfFile(buffer: BufferLike): Promise<string> {
  // pdf-parse is loaded dynamically
  const pdfParse = (await import('pdf-parse')).default;
  const result = await pdfParse(buffer);
  return result.text;
}

/**
 * Get file extension from filename
 */
function getFileExtension(filename: string): string {
  const parts = filename.split('.');
  return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : '';
}

/**
 * Main parsing function
 * Routes to appropriate parser based on file extension
 */
export async function parseFile(file: UploadedFile): Promise<string> {
  const extension = getFileExtension(file.name);

  // Convert base64 to buffer if needed
  let buffer: BufferLike;
  if (typeof file.content === 'string') {
    // If content is a base64 string (from FormData)
    const base64Data = file.content.replace(/^data:[^;]+;base64,/, '');
    buffer = Buffer.from(base64Data, 'base64');
  } else {
    buffer = file.content;
  }

  switch (extension) {
    case 'txt':
      return await parseTxtFile(buffer);
    case 'docx':
      return await parseDocxFile(buffer);
    case 'pdf':
      return await parsePdfFile(buffer);
    default:
      throw new Error(`Unsupported file type: .${extension}`);
  }
}

/**
 * Validate file type
 */
export function isValidFileType(filename: string): boolean {
  const extension = getFileExtension(filename);
  return ['txt', 'docx', 'pdf'].includes(extension);
}

/**
 * Validate file size (max 10MB)
 */
export function isValidFileSize(sizeInBytes: number): boolean {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  return sizeInBytes <= MAX_SIZE;
}
