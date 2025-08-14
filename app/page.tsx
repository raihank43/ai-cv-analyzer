import CVUpload from '@/components/cv-upload'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI CV Analyzer
          </h1>
          <p className="text-lg text-gray-600">
            Upload your CV (PDF or image) and extract text using advanced processing
          </p>
        </div>
        <CVUpload />
      </div>
    </div>
  );
}
