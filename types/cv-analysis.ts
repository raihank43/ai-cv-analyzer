export interface CVAnalysisAspect {
  name: string;
  score: number; // 0-100
  analysis: string;
  actionPoints: string[];
  whyImportant: string;
}

export interface CVAnalysisResult {
  overallScore: number;
  overallImpression: string;
  aspects: {
    contactInformation: CVAnalysisAspect;
    relevantSkills: CVAnalysisAspect;
    professionalSummary: CVAnalysisAspect;
    workExperience: CVAnalysisAspect;
    achievements: CVAnalysisAspect;
    educationCertification: CVAnalysisAspect;
    organizationalActivity: CVAnalysisAspect;
    consistentWriting: CVAnalysisAspect;
    additionalSection: CVAnalysisAspect;
    keywords: CVAnalysisAspect;
  };
  careerRecommendation: string;
  extractedKeywords: {
    jobTitles: string[];
    skills: string[];
    careerPaths: string[];
    professionalSummaries: string[];
    additionalKeywords: string[];
  };
  processingTime: number;
}

export interface AnalysisRequest {
  cvText: string;
  targetRole?: string;
  industry?: string;
  language?: 'id' | 'en';
}
