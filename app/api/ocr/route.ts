import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json({
    success: false,
    error: 'OCR processing has been moved to client-side. This endpoint is no longer in use.',
    message: 'Please use the client-side processing instead.'
  })
}

export async function GET() {
  return NextResponse.json({
    message: 'OCR processing is now handled client-side using Tesseract.js. This API endpoint is deprecated.',
    status: 'deprecated'
  })
}
