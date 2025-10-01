import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { CVAnalysisResult } from "@/types/cv-analysis";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

const ANALYSIS_PROMPT_ID = `
Anda adalah seorang ahli peninjau CV/Resume yang mengkhususkan diri pada pasar kerja Indonesia dan internasional.

Analisis teks CV yang diberikan dan evaluasi berdasarkan 12 aspek kunci, berikan skor (0-100) untuk setiap aspek beserta umpan balik yang detail dan mendalam.

12 aspek yang harus dianalisis:

1. **Informasi Kontak** - Kelengkapan dan profesionalitas detail kontak
2. **Keahlian Relevan** - Relevansi keahlian, spesifisitas, dan optimasi kata kunci
3. **Ringkasan Profesional** - Kualitas dan dampak pernyataan ringkasan/objektif
4. **Pengalaman Kerja** - Kejelasan, relevansi, dan detail riwayat kerja
5. **Pencapaian** - Hasil terukur dan prestasi
6. **Pendidikan & Sertifikasi** - Latar belakang pendidikan dan sertifikasi relevan
7. **Aktivitas Organisasi** - Peran kepemimpinan, kerja sukarela, kegiatan ekstrakurikuler
8. **Penulisan Konsisten & Bebas Kesalahan** - Tata bahasa, format, dan konsistensi
9. **Bagian Tambahan** - Portfolio, bahasa, minat, dan bagian relevan lainnya
10. **Kata Kunci** - Optimasi ATS dan kata kunci yang relevan dengan industri
11. **Kesan Keseluruhan** - Kesan pertama dan kualitas secara keseluruhan
12. **Rekomendasi Karir** - Jalur karir yang disarankan dan perbaikan

Untuk setiap aspek, berikan:
- Skor dari 0-100
- Analisis mendalam dan detail (minimal 6 kalimat yang spesifik dan actionable)
- 4-6 poin tindakan spesifik untuk perbaikan dengan contoh konkret
- Penjelasan mengapa aspek ini penting dengan konteks pasar kerja Indonesia

Juga ekstrak dan kategorikan kata kunci relevan dari CV.

Kembalikan analisis Anda dalam format JSON berikut:

{
  "overallScore": 75,
  "overallImpression": "CV Anda menunjukkan potensi yang kuat tetapi memerlukan penyempurnaan di beberapa area...",
  "aspects": {
    "contactInformation": {
      "name": "Informasi Kontak",
      "score": 85,
      "analysis": "Analisis detail tentang informasi kontak, apa yang sudah baik, apa yang kurang, dan dampaknya terhadap kesan pertama kepada recruiter...",
      "actionPoints": [
        "Tambahkan URL profil LinkedIn yang profesional dan aktif",
        "Gunakan alamat email yang profesional, hindari email pribadi yang kasual",
        "Pertimbangkan menambahkan lokasi/kota tempat tinggal"
      ],
      "whyImportant": "Informasi kontak yang lengkap memastikan recruiter dapat dengan mudah menghubungi Anda dan menunjukkan profesionalisme dalam era digital."
    },
    // ... (struktur serupa untuk semua aspek lainnya)
  },
  "careerRecommendation": "Berdasarkan analisis mendalam CV Anda, berikut adalah rekomendasi karier yang komprehensif. [Berikan analisis 4-6 kalimat yang mencakup: 1) Posisi/peran yang paling cocok berdasarkan kekuatan, 2) Industri atau sektor yang direkomendasikan, 3) Jalur karier jangka pendek dan menengah, 4) Saran spesifik untuk meningkatkan daya saing di pasar kerja Indonesia/internasional, 5) Area fokus pengembangan skill untuk mencapai target karier]",
  "extractedKeywords": {
    "jobTitles": ["Software Engineer", "Developer"],
    "skills": ["JavaScript", "React", "Node.js"],
    "careerPaths": ["Full-Stack Development", "Frontend Development"],
    "professionalSummaries": ["Berpengalaman", "Detail-oriented", "Kolaboratif"],
    "additionalKeywords": ["Kepemimpinan", "Problem-solving"]
  }
}

Teks CV yang akan dianalisis:
`;

const ANALYSIS_PROMPT_EN = `
You are an expert CV/Resume reviewer specializing in Indonesian and international job markets.

Analyze the provided CV text and evaluate it across 12 key aspects, providing a score (0-100) for each aspect along with detailed and comprehensive feedback.

The 12 aspects to analyze are:

1. **Contact Information** - Completeness and professionalism of contact details
2. **Relevant Skills** - Skills relevance, specificity, and keyword optimization  
3. **Professional Summary** - Quality and impact of summary/objective statement
4. **Work Experience** - Clarity, relevance, and detail of work history
5. **Achievements** - Quantifiable results and accomplishments
6. **Education & Certification** - Educational background and relevant certifications
7. **Organizational Activity** - Leadership roles, volunteer work, extracurricular activities
8. **Consistent & Error-free Writing** - Grammar, formatting, and consistency
9. **Additional Section** - Portfolio, languages, interests, and other relevant sections
10. **Keywords** - ATS optimization and industry-relevant keywords
11. **Overall Impression** - First impression and overall quality
12. **Career Recommendation** - Suggested career paths and improvements

For each aspect, provide:
- A score from 0-100
- Deep and detailed analysis (4-6 sentences that are specific and actionable)
- 4-6 specific action points for improvement with concrete examples
- Explanation of why this aspect is important with Indonesian job market context

Also extract and categorize relevant keywords from the CV.

Return your analysis in the following JSON format:

{
  "overallScore": 75,
  "overallImpression": "Your CV shows strong potential but needs refinement in several areas...",
  "aspects": {
    "contactInformation": {
      "name": "Contact Information",
      "score": 85,
      "analysis": "Detailed analysis of contact information, what's good, what's missing, and its impact on first impression to recruiters...",
      "actionPoints": [
        "Add professional and active LinkedIn profile URL",
        "Use professional email address, avoid casual personal emails",
        "Consider adding location/city of residence"
      ],
      "whyImportant": "Complete contact information ensures recruiters can easily reach you and shows professionalism in the digital era."
    },
    // ... (similar structure for all other aspects)
  },
  "careerRecommendation": "Based on comprehensive analysis of your CV, here is a detailed career recommendation. [Provide 4-6 sentences covering: 1) Most suitable positions/roles based on strengths, 2) Recommended industries or sectors, 3) Short-term and medium-term career paths, 4) Specific advice to improve competitiveness in Indonesian/international job market, 5) Focus areas for skill development to achieve career targets]",
  "extractedKeywords": {
    "jobTitles": ["Software Engineer", "Developer"],
    "skills": ["JavaScript", "React", "Node.js"],
    "careerPaths": ["Full-Stack Development", "Frontend Development"],
    "professionalSummaries": ["Experienced", "Detail-oriented", "Collaborative"],
    "additionalKeywords": ["Leadership", "Problem-solving"]
  }
}

CV Text to analyze:
`;

export async function POST(request: NextRequest) {
  try {
    const {
      cvText,
      targetRole,
      industry,
      language = "en",
    } = await request.json();

    if (!cvText || cvText.trim().length === 0) {
      return NextResponse.json(
        { error: "CV text is required for analysis" },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const startTime = Date.now();

    // Select prompt based on language
    const basePrompt =
      language === "id" ? ANALYSIS_PROMPT_ID : ANALYSIS_PROMPT_EN;

    // Enhance prompt with target role and industry if provided
    let enhancedPrompt = basePrompt;
    if (targetRole) {
      enhancedPrompt +=
        language === "id"
          ? `\n\nPosisi Target: ${targetRole}`
          : `\n\nTarget Role: ${targetRole}`;
    }
    if (industry) {
      enhancedPrompt +=
        language === "id"
          ? `\nIndustri Target: ${industry}`
          : `\nTarget Industry: ${industry}`;
    }
    enhancedPrompt += `\n\n${cvText}`;

    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            language === "id"
              ? "Anda adalah ahli peninjau CV. Selalu berikan respons dalam format JSON yang valid sesuai spesifikasi dan gunakan bahasa Indonesia."
              : "You are an expert CV reviewer. Always respond with valid JSON format as specified and use English language.",
        },
        {
          role: "user",
          content: enhancedPrompt,
        },
      ],
      //   temperature: 0.7,
      //   max_completion_tokens: 6000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("No response from OpenAI");
    }

    let analysisResult: CVAnalysisResult;
    try {
      // Extract JSON from response (in case there's extra text)
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : responseText;
      analysisResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Raw response:", responseText);
      throw new Error("Failed to parse OpenAI response as JSON");
    }

    const processingTime = Date.now() - startTime;
    analysisResult.processingTime = processingTime;

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error("CV Analysis error:", error);

    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: "OpenAI API configuration error" },
          { status: 401 }
        );
      }
      if (
        error.message.includes("quota") ||
        error.message.includes("rate limit")
      ) {
        return NextResponse.json(
          { error: "OpenAI API quota exceeded. Please try again later." },
          { status: 429 }
        );
      }
    }

    return NextResponse.json(
      { error: "Failed to analyze CV. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "CV Analysis API endpoint",
    status: "active",
    supportedMethods: ["POST"],
    requiredFields: ["cvText"],
    optionalFields: ["targetRole", "industry"],
  });
}
