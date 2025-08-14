"use client"

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Upload, FileText, Loader2 } from 'lucide-react'

export default function CVUpload() {
  const [file, setFile] = useState<File | null>(null)
  const [extractedText, setExtractedText] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [processingStatus, setProcessingStatus] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile && (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/'))) {
      setFile(selectedFile)
      setExtractedText('')
    } else {
      alert('Please select a PDF file or an image file (PNG, JPG, JPEG)')
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && (droppedFile.type === 'application/pdf' || droppedFile.type.startsWith('image/'))) {
      setFile(droppedFile)
      setExtractedText('')
    } else {
      alert('Please drop a PDF file or an image file (PNG, JPG, JPEG)')
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const convertPdfToImages = async (pdfFile: File): Promise<string[]> => {
    // Dynamic import to avoid SSR issues
    const pdfjsLib = await import('pdfjs-dist')
    
    // Set up the worker using the local file in public directory
    if (typeof window !== 'undefined') {
      pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
    }
    
    const arrayBuffer = await pdfFile.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    
    const images: string[] = []
    
    // Convert each page to image
    for (let pageNum = 1; pageNum <= Math.min(pdf.numPages, 5); pageNum++) { // Limit to first 5 pages
      const page = await pdf.getPage(pageNum)
      
      // Set up canvas for rendering
      const viewport = page.getViewport({ scale: 2.0 }) // Higher scale for better OCR
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      // Render page to canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas
      }).promise
      
      // Convert canvas to image data URL
      const imageDataUrl = canvas.toDataURL('image/png')
      images.push(imageDataUrl)
    }
    
    return images
  }

  const processCV = async () => {
    if (!file) return

    setIsProcessing(true)
    setProgress(0)
    setProcessingStatus('Analyzing file...')
    
    try {
      if (file.type === 'application/pdf') {
        // Convert PDF to images and then perform OCR
        setProcessingStatus('Converting PDF to images...')
        setProgress(20)
        
        try {
          const images = await convertPdfToImages(file)
          
          setProcessingStatus('Loading OCR engine...')
          setProgress(40)
          
          const { createWorker } = await import('tesseract.js')
          const worker = await createWorker('eng')
          
          let combinedText = ''
          
          // Process each page
          for (let i = 0; i < images.length; i++) {
            setProcessingStatus(`Processing page ${i + 1} of ${images.length}...`)
            setProgress(40 + (40 * (i + 1) / images.length))
            
            const { data: { text } } = await worker.recognize(images[i])
            
            if (text.trim()) {
              combinedText += `\n--- Page ${i + 1} ---\n${text.trim()}\n`
            }
          }
          
          setProcessingStatus('Finalizing...')
          setProgress(90)
          
          await worker.terminate()
          
          setProgress(100)
          setProcessingStatus('OCR Complete!')
          
          if (combinedText.trim()) {
            setExtractedText(combinedText.trim())
          } else {
            setExtractedText(`📄 PDF Processing Complete!\n\n⚠️ No readable text found in this PDF.\n\nFile Details:\n- Name: ${file.name}\n- Size: ${(file.size / 1024).toFixed(2)} KB\n- Pages processed: ${images.length}\n\nThis might be because:\n- The PDF contains only images without text\n- The text is too small or blurry\n- The document is in a language not supported\n- Poor image quality in the PDF\n\nTry using a higher quality PDF with clear, readable text.`)
          }
          
        } catch (pdfError) {
          console.error('PDF processing error:', pdfError)
          setExtractedText(`❌ Error processing PDF: ${pdfError instanceof Error ? pdfError.message : 'Unknown error'}\n\nThis might be due to:\n- Corrupted PDF file\n- Password-protected PDF\n- Unsupported PDF format\n- Browser compatibility issues\n\nTry using a different PDF file or browser.`)
        }
        
      } else {
        // Handle image files with Tesseract.js OCR
        setProcessingStatus('Loading OCR engine...')
        setProgress(20)
        
        const { createWorker } = await import('tesseract.js')
        
        setProcessingStatus('Initializing Tesseract.js...')
        setProgress(40)
        
        const worker = await createWorker('eng')
        
        setProcessingStatus('Performing OCR on image...')
        setProgress(70)
        
        const { data: { text } } = await worker.recognize(file)
        
        setProcessingStatus('Finalizing...')
        setProgress(90)
        
        await worker.terminate()
        
        setProgress(100)
        setProcessingStatus('OCR Complete!')
        
        if (text.trim()) {
          setExtractedText(text.trim())
        } else {
          setExtractedText('⚠️ No text could be extracted from this image. The image might be:\n- Too blurry or low quality\n- In a language not supported\n- Contains no readable text\n\nTry uploading a clearer image with visible text.')
        }
      }
      
    } catch (error) {
      console.error('Error processing file:', error)
      setExtractedText(`❌ Error processing file: ${error instanceof Error ? error.message : 'Unknown error'}\n\nThis might be due to:\n- Unsupported file format\n- File corruption\n- Browser compatibility issues\n\nPlease try a different file or browser.`)
    } finally {
      setIsProcessing(false)
      setProgress(0)
      setProcessingStatus('')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-6 h-6" />
            CV Upload & Text Analysis
          </CardTitle>
          <CardDescription>
            Upload a PDF CV or image file to extract and analyze text content
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* File Upload Area */}
          <div className="space-y-4">
            <Label htmlFor="cv-upload">Upload CV (PDF or Image)</Label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg font-medium text-gray-600 mb-2">
                Drag & drop your CV here, or click to browse
              </p>
              <p className="text-sm text-gray-500">PDF files or images (PNG, JPG, JPEG)</p>
              <Input
                ref={fileInputRef}
                id="cv-upload"
                type="file"
                accept=".pdf,image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Selected File Info */}
          {file && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">{file.name}</p>
                    <p className="text-sm text-blue-600">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    onClick={processCV}
                    disabled={isProcessing}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Process File'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>🔍 {processingStatus}</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
              <p className="text-xs text-gray-500 text-center">
                {file?.type === 'application/pdf' 
                  ? 'Converting PDF pages to images, then processing with OCR' 
                  : 'Processing on your device - no data sent to server'
                }
              </p>
            </div>
          )}

          {/* Extracted Text */}
          {extractedText && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  {extractedText.startsWith('❌') ? (
                    <>
                      <span className="text-red-500">⚠️</span>
                      Extraction Result
                    </>
                  ) : (
                    <>
                      <span className="text-green-500">✅</span>
                      Extracted Text
                    </>
                  )}
                </CardTitle>
                <CardDescription>
                  {extractedText.startsWith('❌') 
                    ? 'There was an issue with text extraction' 
                    : 'Text content successfully extracted from your CV'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={extractedText}
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Extracted text will appear here..."
                />
                <div className="mt-4 text-sm text-gray-600">
                  <p>Characters: {extractedText.length}</p>
                  <p>Words: {extractedText.split(/\s+/).filter(word => word).length}</p>
                  <p>Lines: {extractedText.split('\n').length}</p>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
