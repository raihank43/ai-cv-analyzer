# AI CV Analyzer 🤖📄

Aplikasi Next.js untuk menganalisis CV menggunakan OCR dan AI. Upload file PDF atau gambar, ekstrak teks, dan dapatkan analisis komprehensif menggunakan OpenAI.

## ✨ Fitur

- 📄 **Upload PDF & Gambar**: Drag & drop atau klik untuk upload CV dalam format PDF, PNG, JPG
- 🔍 **OCR Text Extraction**: Ekstrak teks dari PDF dan gambar menggunakan Tesseract.js
- 🤖 **AI Analysis**: Analisis CV comprehensive menggunakan OpenAI dengan 12 aspek penilaian
- 📊 **Scoring System**: Skor 0-100 untuk setiap aspek dengan feedback detail
- 💡 **Action Points**: Rekomendasi perbaikan spesifik untuk setiap aspek
- 🎯 **Career Recommendation**: Saran karir berdasarkan profil CV
- 🔑 **Keywords Extraction**: Identifikasi keywords penting untuk ATS optimization

## 🎯 12 Aspek Analisis CV

1. **Overall Impression** - Kesan pertama dan kualitas keseluruhan
2. **Contact Information** - Kelengkapan dan profesionalitas kontak
3. **Relevant Skills** - Relevansi, spesifisitas, dan optimasi keyword
4. **Professional Summary** - Kualitas dan dampak summary/objective
5. **Work Experience** - Kejelasan, relevansi, dan detail pengalaman kerja
6. **Achievements** - Pencapaian terukur dan accomplishments
7. **Education & Certification** - Latar belakang pendidikan dan sertifikasi
8. **Organizational Activity** - Aktivitas organisasi, volunteer, leadership
9. **Consistent & Error-free Writing** - Grammar, formatting, konsistensi
10. **Additional Section** - Portfolio, bahasa, minat, dan bagian relevan lainnya
11. **Keywords** - Optimasi ATS dan keywords industri
12. **Career Recommendation** - Saran jalur karir dan perbaikan

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- OpenAI API Key

### Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Setup Environment Variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` dan tambahkan OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```

3. **Run Development Server**
   ```bash
   npm run dev
   ```

4. **Open Browser**
   ```
   http://localhost:3000
   ```

## 💰 OpenAI Costs

- **gpt-4o-mini**: ~$0.01-0.03 per analysis (recommended)
- **gpt-4**: ~$0.10-0.30 per analysis (premium)

## 🔒 Privacy & Security

- ✅ Client-side OCR processing
- ✅ No CV data storage
- ✅ Secure OpenAI API integration
