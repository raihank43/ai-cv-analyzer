declare module 'scribe.js-ocr' {
  export interface RecognizeOptions {
    output?: {
      text?: boolean
      pdf?: boolean
      hocr?: boolean
    }
    recognize?: {
      language?: string[]
    }
  }

  export interface RecognizeResult {
    text?: string
    pdf?: Buffer
    hocr?: string
  }

  export interface ScribeAPI {
    recognize(
      input: Buffer | Uint8Array | string,
      options?: RecognizeOptions
    ): Promise<RecognizeResult>
    
    init(params?: { pdf?: boolean }): Promise<void>
    terminate(): Promise<void>
    clear(): Promise<void>
  }

  declare const scribe: ScribeAPI
  export default scribe
}

declare module 'pdfjs-dist' {
  export interface PageViewport {
    width: number
    height: number
  }
  
  export interface PDFPageProxy {
    getViewport(params: { scale: number }): PageViewport
    render(params: {
      canvasContext: CanvasRenderingContext2D
      viewport: PageViewport
      canvas: HTMLCanvasElement
    }): { promise: Promise<void> }
  }
  
  export interface PDFDocumentProxy {
    numPages: number
    getPage(pageNumber: number): Promise<PDFPageProxy>
  }
  
  export interface GlobalWorkerOptions {
    workerSrc: string
  }
  
  export const GlobalWorkerOptions: GlobalWorkerOptions
  export const version: string
  
  export function getDocument(params: { data: ArrayBuffer }): {
    promise: Promise<PDFDocumentProxy>
  }
}
