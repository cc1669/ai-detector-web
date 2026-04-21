/**
 * API Route: /api/detect
 *
 * Handles text and file upload for AI content detection
 * POST method accepts JSON with text or FormData with file
 */

import { NextRequest, NextResponse } from 'next/server';
import { detectAIContent } from '@/lib/detectionEngine';
import { parseFile, isValidFileType, isValidFileSize } from '@/lib/fileParser';
import { DetectionResponse, UploadedFile } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60; // 60 seconds timeout

/**
 * Handle POST requests for AI detection
 */
export async function POST(request: NextRequest): Promise<NextResponse<DetectionResponse>> {
  try {
    let text: string;
    let fileName: string | undefined;

    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file') as File | null;

      if (!file) {
        return NextResponse.json(
          { success: false, error: 'No file provided' },
          { status: 400 }
        );
      }

      // Validate file type
      if (!isValidFileType(file.name)) {
        return NextResponse.json(
          { success: false, error: 'Unsupported file type. Please upload .txt, .docx, or .pdf files.' },
          { status: 400 }
        );
      }

      // Validate file size
      if (!isValidFileSize(file.size)) {
        return NextResponse.json(
          { success: false, error: 'File size exceeds 10MB limit' },
          { status: 400 }
        );
      }

      fileName = file.name;

      // Read file content
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Parse file based on type
      text = await parseFile({
        name: file.name,
        content: buffer.toString('base64'),
        type: file.type,
      });

    } else {
      // Handle JSON request with text
      const body = await request.json();

      if (!body.text || typeof body.text !== 'string') {
        return NextResponse.json(
          { success: false, error: 'No text provided' },
          { status: 400 }
        );
      }

      text = body.text;
      fileName = body.fileName;
    }

    // Validate text
    if (!text.trim()) {
      return NextResponse.json(
        { success: false, error: 'Text content is empty' },
        { status: 400 }
      );
    }

    if (text.length < 50) {
      return NextResponse.json(
        { success: false, error: 'Text must be at least 50 characters long' },
        { status: 400 }
      );
    }

    // Run AI detection (async with MiniMax API)
    const result = await detectAIContent(text);

    return NextResponse.json({
      success: true,
      data: result,
    });

  } catch (error) {
    console.error('Detection error:', error);

    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
