"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  User,
  Briefcase,
  Loader2,
  Award,
  GraduationCap,
  Users,
  FileText,
  Plus,
  Hash,
  Star,
  Eye,
  Zap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { CVAnalysisResult } from "@/types/cv-analysis";
import { Textarea } from "./ui/textarea";

interface CVAnalysisDisplayProps {
  cvText: string;
  onAnalysisComplete?: (result: CVAnalysisResult) => void;
}

export default function CVAnalysisDisplay({
  cvText,
  onAnalysisComplete,
}: CVAnalysisDisplayProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<CVAnalysisResult | null>(
    null
  );
  const [targetRole, setTargetRole] = useState("");
  const [industry, setIndustry] = useState("");
  const [language, setLanguage] = useState<"id" | "en">("en");
  const [error, setError] = useState<string | null>(null);
  const [activeAspect, setActiveAspect] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "overview" | "aspects" | "keywords" | "recommendation"
  >("overview");
  const [showExtractedText, setShowExtractedText] = useState(false);

  const aspectData = {
    contactInformation: {
      icon: User,
      title: language === "id" ? "Informasi Kontak" : "Contact Information",
      description:
        language === "id"
          ? "Kelengkapan dan profesionalitas informasi kontak"
          : "Completeness and professionalism of contact details",
    },
    relevantSkills: {
      icon: Target,
      title: language === "id" ? "Keahlian Relevan" : "Relevant Skills",
      description:
        language === "id"
          ? "Relevansi, spesifisitas, dan optimasi kata kunci keahlian"
          : "Skills relevance, specificity, and keyword optimization",
    },
    professionalSummary: {
      icon: FileText,
      title:
        language === "id" ? "Ringkasan Profesional" : "Professional Summary",
      description:
        language === "id"
          ? "Kualitas dan dampak ringkasan atau objective statement"
          : "Quality and impact of summary or objective statement",
    },
    workExperience: {
      icon: Briefcase,
      title: language === "id" ? "Pengalaman Kerja" : "Work Experience",
      description:
        language === "id"
          ? "Kejelasan, relevansi, dan detail pengalaman kerja"
          : "Clarity, relevance, and detail of work experience",
    },
    achievements: {
      icon: Award,
      title: language === "id" ? "Pencapaian" : "Achievements",
      description:
        language === "id"
          ? "Pencapaian terukur dan accomplishments yang menonjol"
          : "Quantifiable results and notable accomplishments",
    },
    educationCertification: {
      icon: GraduationCap,
      title:
        language === "id"
          ? "Pendidikan & Sertifikasi"
          : "Education & Certification",
      description:
        language === "id"
          ? "Latar belakang pendidikan dan sertifikasi relevan"
          : "Educational background and relevant certifications",
    },
    organizationalActivity: {
      icon: Users,
      title:
        language === "id" ? "Aktivitas Organisasi" : "Organizational Activity",
      description:
        language === "id"
          ? "Aktivitas organisasi, volunteer work, dan leadership"
          : "Organizational activities, volunteer work, and leadership",
    },
    consistentWriting: {
      icon: CheckCircle,
      title: language === "id" ? "Penulisan Konsisten" : "Consistent Writing",
      description:
        language === "id"
          ? "Grammar, formatting, dan konsistensi penulisan"
          : "Grammar, formatting, and writing consistency",
    },
    additionalSection: {
      icon: Plus,
      title: language === "id" ? "Bagian Tambahan" : "Additional Section",
      description:
        language === "id"
          ? "Portfolio, bahasa, minat, dan bagian relevan lainnya"
          : "Portfolio, languages, interests, and other relevant sections",
    },
    keywords: {
      icon: Hash,
      title:
        language === "id" ? "Optimasi Kata Kunci" : "Keywords Optimization",
      description:
        language === "id"
          ? "Optimasi ATS dan kata kunci industri yang relevan"
          : "ATS optimization and relevant industry keywords",
    },
    overallImpression: {
      icon: Star,
      title: language === "id" ? "Kesan Keseluruhan" : "Overall Impression",
      description:
        language === "id"
          ? "Kesan pertama dan kualitas keseluruhan CV"
          : "First impression and overall CV quality",
    },
    careerRecommendation: {
      icon: Target,
      title: language === "id" ? "Rekomendasi Karier" : "Career Recommendation",
      description:
        language === "id"
          ? "Saran jalur karier dan area pengembangan"
          : "Career path suggestions and development areas",
    },
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreColorBg = (score: number) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-yellow-600";
    return "bg-red-600";
  };

  const getBadgeVariant = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-800 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const analyzeCV = async () => {
    if (!cvText.trim()) {
      setError(
        language === "id"
          ? "Tidak ada teks CV untuk dianalisis"
          : "No CV text available for analysis"
      );
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null); // Clear previous results

    try {
      const response = await fetch("/api/cv-analysis", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cvText,
          targetRole: targetRole.trim() || undefined,
          industry: industry.trim() || undefined,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            (language === "id" ? "Analisis gagal" : "Analysis failed")
        );
      }

      const result: CVAnalysisResult = await response.json();
      setAnalysisResult(result);
      setActiveAspect(Object.keys(result.aspects)[0]);
      setActiveTab("overview");
      onAnalysisComplete?.(result);
    } catch (error) {
      console.error("Analysis error:", error);
      setError(
        error instanceof Error
          ? error.message
          : language === "id"
          ? "Gagal menganalisis CV"
          : "Failed to analyze CV"
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!cvText.trim()) {
    return (
      <div className="w-full max-w-7xl mx-auto px-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-6 h-6" />
              AI CV Analysis
            </CardTitle>
            <CardDescription>
              Upload and extract text from your CV first to enable AI analysis
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      {/* Analysis Input Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI CV Analysis
          </CardTitle>
          <CardDescription>
            Get comprehensive feedback on your CV across 12 key aspects using AI
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="target-role">
                {language === "id"
                  ? "Posisi Target (Opsional)"
                  : "Target Role (Optional)"}
              </Label>
              <Input
                id="target-role"
                placeholder={
                  language === "id"
                    ? "Misal: Software Engineer, Marketing Manager"
                    : "e.g., Software Engineer, Marketing Manager"
                }
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="industry">
                {language === "id"
                  ? "Industri (Opsional)"
                  : "Industry (Optional)"}
              </Label>
              <Input
                id="industry"
                placeholder={
                  language === "id"
                    ? "Misal: Teknologi, Keuangan, Kesehatan"
                    : "e.g., Technology, Finance, Healthcare"
                }
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                disabled={isAnalyzing}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">
                {language === "id" ? "Bahasa Analisis" : "Analysis Language"}
              </Label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value as "id" | "en")}
                disabled={isAnalyzing}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="en">English</option>
                <option value="id">Bahasa Indonesia</option>
              </select>
            </div>
          </div>

          <Button
            onClick={analyzeCV}
            disabled={isAnalyzing}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isAnalyzing ? (
              <>
                <Brain className="w-4 h-4 mr-2 animate-pulse" />
                {language === "id"
                  ? "Menganalisis CV dengan AI..."
                  : "Analyzing CV with AI..."}
              </>
            ) : (
              <>
                <TrendingUp className="w-4 h-4 mr-2" />
                {language === "id"
                  ? "Analisis CV dengan AI"
                  : "Analyze CV with AI"}
              </>
            )}
          </Button>

          {/* Extracted Text Section */}
          <div className="space-y-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowExtractedText(!showExtractedText)}
              className="flex items-center gap-2 text-sm"
            >
              {showExtractedText ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  {language === "id"
                    ? "Sembunyikan Teks yang Diekstrak"
                    : "Hide Extracted Text"}
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {language === "id"
                    ? "Tampilkan Teks yang Diekstrak"
                    : "Show Extracted Text"}
                </>
              )}
            </Button>

            {showExtractedText && (
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  {language === "id"
                    ? "Teks CV yang Diekstrak"
                    : "Extracted CV Text"}
                </h4>
                <Textarea
                  value={
                    cvText ||
                    (language === "id"
                      ? "Tidak ada teks yang diekstrak"
                      : "No text extracted")
                  }
                  readOnly
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="Extracted text will appear here..."
                />

                <p className="text-xs text-gray-500 mt-2">
                  {language === "id"
                    ? "Teks ini akan dianalisis oleh AI untuk memberikan feedback yang akurat."
                    : "This text will be analyzed by AI to provide accurate feedback."}
                </p>
                <div className="text-xs text-gray-500 mt-2">
                  <p>Characters: {cvText.length}</p>
                  <p>
                    Words: {cvText.split(/\s+/).filter((word) => word).length}
                  </p>
                  <p>Lines: {cvText.split("\n").length}</p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-800">
                <AlertCircle className="w-5 h-5" />
                <span className="font-medium">
                  {language === "id" ? "Kesalahan Analisis" : "Analysis Error"}
                </span>
              </div>
              <p className="text-red-700 mt-1">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {isAnalyzing && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Loading Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {language === "id" ? "Menganalisis CV..." : "Analyzing CV..."}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-3">
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {language === "id" ? "Memuat..." : "Loading..."}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Loading Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2"></div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-gray-50 border rounded-lg">
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6"></div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded animate-pulse w-12"></div>
                      </div>
                      <div className="h-2 bg-gray-200 rounded animate-pulse mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {analysisResult && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar with Tabs */}
          <div className="lg:col-span-1 space-y-4">
            {/* Overall Score Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Star className="w-5 h-5" />
                  {language === "id" ? "Skor Keseluruhan" : "Overall Score"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div
                    className={`text-3xl font-bold ${getScoreColor(
                      analysisResult.overallScore
                    )}`}
                  >
                    {analysisResult.overallScore}/100
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${getScoreColorBg(
                        analysisResult.overallScore
                      )}`}
                      style={{ width: `${analysisResult.overallScore}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  {language === "id" ? "Navigasi" : "Navigation"}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "overview"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4" />
                      {language === "id" ? "Ringkasan" : "Overview"}
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("aspects")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "aspects"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {language === "id"
                        ? "Analisis Detail"
                        : "Detailed Analysis"}
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("keywords")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "keywords"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Hash className="w-4 h-4" />
                      {language === "id" ? "Kata Kunci" : "Keywords"}
                    </div>
                  </button>
                  <button
                    onClick={() => setActiveTab("recommendation")}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                      activeTab === "recommendation"
                        ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                        : "hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      {language === "id" ? "Saran Karier" : "Career Advice"}
                    </div>
                  </button>
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {activeTab === "overview" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-6 h-6" />
                    {language === "id"
                      ? "Ringkasan Analisis Keseluruhan"
                      : "Overall Analysis Overview"}
                  </CardTitle>
                  <CardDescription>
                    {language === "id"
                      ? "Ringkasan performa CV Anda di semua aspek"
                      : "Summary of your CV performance across all aspects"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-gray-700 leading-relaxed">
                      {analysisResult.overallImpression}
                    </p>
                  </div>

                  {/* Aspects Grid Overview */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(analysisResult.aspects).map(
                      ([key, aspect]) => {
                        const data = aspectData[key as keyof typeof aspectData];
                        const IconComponent = data?.icon || FileText;
                        return (
                          <div
                            key={key}
                            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                            onClick={() => {
                              setActiveAspect(key);
                              setActiveTab("aspects");
                            }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <IconComponent className="w-5 h-5 text-gray-600" />
                                <span className="font-medium text-gray-900">
                                  {data?.title || aspect.name}
                                </span>
                              </div>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium border ${getBadgeVariant(
                                  aspect.score
                                )}`}
                              >
                                {aspect.score}%
                              </div>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-500 ${getScoreColorBg(
                                  aspect.score
                                )}`}
                                style={{ width: `${aspect.score}%` }}
                              ></div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {data?.description ||
                                (language === "id"
                                  ? "Aspek penting dalam evaluasi CV"
                                  : "Important aspect in CV evaluation")}
                            </p>
                          </div>
                        );
                      }
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "aspects" && (
              <div className="space-y-6">
                {/* Aspect Selector */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle>
                      {language === "id"
                        ? "Pilih Aspek untuk Ditinjau"
                        : "Select Aspect to Review"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
                      {Object.entries(analysisResult.aspects).map(
                        ([key, aspect]) => {
                          const data =
                            aspectData[key as keyof typeof aspectData];
                          const IconComponent = data?.icon || FileText;
                          return (
                            <button
                              key={key}
                              onClick={() => setActiveAspect(key)}
                              className={`p-3 text-center rounded-lg border transition-colors ${
                                activeAspect === key
                                  ? "bg-blue-50 border-blue-500 text-blue-700"
                                  : "hover:bg-gray-50 border-gray-200"
                              }`}
                            >
                              <IconComponent className="w-5 h-5 mx-auto mb-1" />
                              <div className="text-xs font-medium">
                                {data?.title.split(" ")[0] ||
                                  aspect.name.split(" ")[0]}
                              </div>
                              <div
                                className={`text-xs px-1 py-0.5 rounded font-medium ${getBadgeVariant(
                                  aspect.score
                                )}`}
                              >
                                {aspect.score}%
                              </div>
                            </button>
                          );
                        }
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Selected Aspect Detail */}
                {activeAspect &&
                  analysisResult.aspects[
                    activeAspect as keyof typeof analysisResult.aspects
                  ] && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            {(() => {
                              const data =
                                aspectData[
                                  activeAspect as keyof typeof aspectData
                                ];
                              const IconComponent = data?.icon || FileText;
                              return <IconComponent className="w-6 h-6" />;
                            })()}
                            {aspectData[activeAspect as keyof typeof aspectData]
                              ?.title ||
                              analysisResult.aspects[
                                activeAspect as keyof typeof analysisResult.aspects
                              ].name}
                          </span>
                          <div
                            className={`text-lg px-3 py-1 rounded-full border font-medium ${getBadgeVariant(
                              analysisResult.aspects[
                                activeAspect as keyof typeof analysisResult.aspects
                              ].score
                            )}`}
                          >
                            {
                              analysisResult.aspects[
                                activeAspect as keyof typeof analysisResult.aspects
                              ].score
                            }
                            /100
                          </div>
                        </CardTitle>
                        <CardDescription>
                          {aspectData[activeAspect as keyof typeof aspectData]
                            ?.description ||
                            (language === "id"
                              ? "Aspek penting dalam evaluasi CV"
                              : "Important aspect in CV evaluation")}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div
                            className={`h-3 rounded-full transition-all duration-500 ${getScoreColorBg(
                              analysisResult.aspects[
                                activeAspect as keyof typeof analysisResult.aspects
                              ].score
                            )}`}
                            style={{
                              width: `${
                                analysisResult.aspects[
                                  activeAspect as keyof typeof analysisResult.aspects
                                ].score
                              }%`,
                            }}
                          ></div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-blue-500" />
                            {language === "id" ? "Analisis" : "Analysis"}
                          </h4>
                          <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {
                              analysisResult.aspects[
                                activeAspect as keyof typeof analysisResult.aspects
                              ].analysis
                            }
                          </p>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            {language === "id"
                              ? "Poin Tindakan"
                              : "Action Points"}
                          </h4>
                          <ul className="space-y-3">
                            {analysisResult.aspects[
                              activeAspect as keyof typeof analysisResult.aspects
                            ].actionPoints.map((point, index) => (
                              <li
                                key={index}
                                className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg"
                              >
                                <div className="w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                  {index + 1}
                                </div>
                                <span className="text-gray-700 leading-relaxed">
                                  {point}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4 border-t bg-blue-50 p-4 rounded-lg">
                          <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                            <Target className="w-4 h-4" />
                            {language === "id"
                              ? "Mengapa Hal Ini Penting"
                              : "Why This Matters"}
                          </h4>
                          <p className="text-blue-800 text-sm leading-relaxed">
                            {
                              analysisResult.aspects[
                                activeAspect as keyof typeof analysisResult.aspects
                              ].whyImportant
                            }
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
              </div>
            )}

            {activeTab === "keywords" && analysisResult.extractedKeywords && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="w-6 h-6" />
                    Extracted Keywords Analysis
                  </CardTitle>
                  <CardDescription>
                    Key terms and phrases identified in your CV for ATS
                    optimization
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {Object.entries(analysisResult.extractedKeywords).map(
                    ([category, keywords]) => (
                      <div key={category} className="space-y-3">
                        <h4 className="font-medium text-gray-900 text-lg capitalize flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          {category.replace(/([A-Z])/g, " $1").trim()}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {keywords.map((keyword, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 transition-colors"
                            >
                              {keyword}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">
                      💡{" "}
                      {language === "id"
                        ? "Tips Optimasi ATS"
                        : "ATS Optimization Tips"}
                    </h4>
                    <ul className="text-blue-800 text-sm space-y-1">
                      {language === "id" ? (
                        <>
                          <li>
                            • Sertakan kata kunci industri secara alami dalam
                            konten Anda
                          </li>
                          <li>
                            • Gunakan akronim dan bentuk lengkap (misalnya, "AI"
                            dan "Kecerdasan Buatan")
                          </li>
                          <li>
                            • Cocokkan kata kunci dari deskripsi pekerjaan yang
                            Anda lamar
                          </li>
                          <li>
                            • Hindari penumpukan kata kunci - fokus pada
                            integrasi alami
                          </li>
                        </>
                      ) : (
                        <>
                          <li>
                            • Include industry-specific keywords naturally in
                            your content
                          </li>
                          <li>
                            • Use both acronyms and full forms (e.g., "AI" and
                            "Artificial Intelligence")
                          </li>
                          <li>
                            • Match keywords from job descriptions you're
                            applying to
                          </li>
                          <li>
                            • Avoid keyword stuffing - focus on natural
                            integration
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === "recommendation" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-6 h-6" />
                    {language === "id"
                      ? "Rekomendasi Karier"
                      : "Career Recommendation"}
                  </CardTitle>
                  <CardDescription>
                    {language === "id"
                      ? "Saran karier yang dipersonalisasi berdasarkan analisis CV Anda"
                      : "Personalized career advice based on your CV analysis"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Performance Summary */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {
                          Object.entries(analysisResult.aspects).filter(
                            ([_, aspect]) => aspect.score >= 80
                          ).length
                        }
                      </div>
                      <div className="text-sm text-green-700 font-medium">
                        {language === "id" ? "Kekuatan" : "Strengths"}
                      </div>
                      <div className="text-xs text-green-600">
                        {language === "id" ? "Skor ≥ 80%" : "Score ≥ 80%"}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">
                        {
                          Object.entries(analysisResult.aspects).filter(
                            ([_, aspect]) =>
                              aspect.score >= 60 && aspect.score < 80
                          ).length
                        }
                      </div>
                      <div className="text-sm text-yellow-700 font-medium">
                        {language === "id" ? "Pengembangan" : "Development"}
                      </div>
                      <div className="text-xs text-yellow-600">
                        {language === "id" ? "60-79%" : "60-79%"}
                      </div>
                    </div>

                    <div className="text-center p-4 bg-red-50 border border-red-200 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        {
                          Object.entries(analysisResult.aspects).filter(
                            ([_, aspect]) => aspect.score < 60
                          ).length
                        }
                      </div>
                      <div className="text-sm text-red-700 font-medium">
                        {language === "id" ? "Kelemahan" : "Weaknesses"}
                      </div>
                      <div className="text-xs text-red-600">
                        {language === "id" ? "Skor < 60%" : "Score < 60%"}
                      </div>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                      <p className="text-gray-700 leading-relaxed text-lg">
                        {analysisResult.careerRecommendation}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mt-6">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <h4 className="font-medium text-green-900 mb-3 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {language === "id" ? "Kekuatan Anda" : "Your Strengths"}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.aspects)
                          .filter(([_, aspect]) => aspect.score >= 80)
                          .map(([key, aspect]) => (
                            <div key={key} className="text-green-800 text-sm">
                              <div className="font-medium">
                                •{" "}
                                {aspectData[key as keyof typeof aspectData]
                                  ?.title || aspect.name}
                              </div>
                              <div className="text-xs text-green-700 ml-3 mt-1">
                                {aspect.analysis.split(".")[0]}.
                              </div>
                            </div>
                          ))}
                        {Object.entries(analysisResult.aspects).filter(
                          ([_, aspect]) => aspect.score >= 80
                        ).length === 0 && (
                          <p className="text-green-700 text-sm italic">
                            {language === "id"
                              ? "Terus tingkatkan performa di semua aspek untuk mencapai kekuatan yang menonjol."
                              : "Continue improving performance in all aspects to achieve outstanding strengths."}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-medium text-red-900 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {language === "id"
                          ? "Kelemahan Anda"
                          : "Your Weaknesses"}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.aspects)
                          .filter(([_, aspect]) => aspect.score < 60)
                          .map(([key, aspect]) => (
                            <div key={key} className="text-red-800 text-sm">
                              <div className="font-medium">
                                •{" "}
                                {aspectData[key as keyof typeof aspectData]
                                  ?.title || aspect.name}
                              </div>
                              <div className="text-xs text-red-700 ml-3 mt-1">
                                {aspect.actionPoints[0] ||
                                  (language === "id"
                                    ? "Perlu perbaikan segera"
                                    : "Requires immediate attention")}
                              </div>
                            </div>
                          ))}
                        {Object.entries(analysisResult.aspects).filter(
                          ([_, aspect]) => aspect.score < 60
                        ).length === 0 && (
                          <p className="text-red-700 text-sm italic">
                            {language === "id"
                              ? "Tidak ada kelemahan signifikan yang teridentifikasi. Pertahankan performa yang baik!"
                              : "No significant weaknesses identified. Keep up the good performance!"}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <h4 className="font-medium text-yellow-900 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4" />
                        {language === "id"
                          ? "Area Pengembangan"
                          : "Areas for Improvement"}
                      </h4>
                      <div className="space-y-2">
                        {Object.entries(analysisResult.aspects)
                          .filter(
                            ([_, aspect]) =>
                              aspect.score >= 60 && aspect.score < 80
                          )
                          .map(([key, aspect]) => (
                            <div key={key} className="text-yellow-800 text-sm">
                              <div className="font-medium">
                                •{" "}
                                {aspectData[key as keyof typeof aspectData]
                                  ?.title || aspect.name}
                              </div>
                              <div className="text-xs text-yellow-700 ml-3 mt-1">
                                {aspect.actionPoints[0] ||
                                  (language === "id"
                                    ? "Dapat ditingkatkan lebih lanjut"
                                    : "Can be further improved")}
                              </div>
                            </div>
                          ))}
                        {Object.entries(analysisResult.aspects).filter(
                          ([_, aspect]) =>
                            aspect.score >= 60 && aspect.score < 80
                        ).length === 0 && (
                          <p className="text-yellow-700 text-sm italic">
                            {language === "id"
                              ? "Semua aspek sudah baik. Fokus pada peningkatan ke level excellence."
                              : "All aspects are performing well. Focus on reaching excellence level."}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Plan */}
                  <div className="p-6 bg-gray-50 border border-gray-200 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-4 flex items-center gap-2">
                      <Target className="w-5 h-5 text-blue-500" />
                      {language === "id"
                        ? "Rencana Tindakan Prioritas"
                        : "Priority Action Plan"}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">
                          {language === "id"
                            ? "🎯 Fokus Jangka Pendek (1-3 bulan)"
                            : "🎯 Short-term Focus (1-3 months)"}
                        </h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {Object.entries(analysisResult.aspects)
                            .filter(([_, aspect]) => aspect.score < 60)
                            .slice(0, 3)
                            .map(([key, aspect]) => (
                              <li key={key} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span>
                                  <strong>
                                    {
                                      aspectData[key as keyof typeof aspectData]
                                        ?.title
                                    }
                                    :
                                  </strong>{" "}
                                  {aspect.actionPoints[0]}
                                </span>
                              </li>
                            ))}
                          {Object.entries(analysisResult.aspects).filter(
                            ([_, aspect]) => aspect.score < 60
                          ).length === 0 && (
                            <li className="text-gray-600 italic">
                              {language === "id"
                                ? "Tidak ada area kritis yang memerlukan perbaikan segera."
                                : "No critical areas requiring immediate improvement."}
                            </li>
                          )}
                        </ul>
                      </div>

                      <div>
                        <h5 className="font-medium text-gray-800 mb-2">
                          {language === "id"
                            ? "🚀 Pengembangan Jangka Menengah (3-6 bulan)"
                            : "🚀 Medium-term Development (3-6 months)"}
                        </h5>
                        <ul className="text-sm text-gray-700 space-y-1">
                          {Object.entries(analysisResult.aspects)
                            .filter(
                              ([_, aspect]) =>
                                aspect.score >= 60 && aspect.score < 80
                            )
                            .slice(0, 3)
                            .map(([key, aspect]) => (
                              <li key={key} className="flex items-start gap-2">
                                <span className="text-yellow-500 mt-1">•</span>
                                <span>
                                  <strong>
                                    {
                                      aspectData[key as keyof typeof aspectData]
                                        ?.title
                                    }
                                    :
                                  </strong>{" "}
                                  {aspect.actionPoints[0]}
                                </span>
                              </li>
                            ))}
                          {Object.entries(analysisResult.aspects).filter(
                            ([_, aspect]) =>
                              aspect.score >= 60 && aspect.score < 80
                          ).length === 0 && (
                            <li className="text-gray-600 italic">
                              {language === "id"
                                ? "Semua aspek sudah dalam kondisi baik. Fokus pada excellence level."
                                : "All aspects are in good condition. Focus on reaching excellence level."}
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 text-center text-sm text-gray-500 border-t pt-4">
                    Analysis completed in{" "}
                    {(analysisResult.processingTime / 1000).toFixed(1)} seconds
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
