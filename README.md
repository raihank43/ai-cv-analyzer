# AI CV Analyzer 🤖📄

A smart CV analysis tool that helps you improve your resume using AI technology. Simply upload your CV as a PDF or image file, and get detailed feedback on 12 key aspects that matter to recruiters.

## What Can This Tool Do?

- **Easy Upload**: Just drag and drop your CV file (PDF, PNG, or JPG) - no complicated setup needed
- **Text Recognition**: Automatically reads text from your CV, even from scanned documents
- **Smart Analysis**: Uses OpenAI to analyze your CV like a professional recruiter would
- **Detailed Scoring**: Get scores from 0-100 on different aspects of your CV
- **Actionable Feedback**: Specific suggestions on what to improve and how
- **Career Insights**: Personalized career recommendations based on your profile
- **ATS Optimization**: Helps identify important keywords to get past applicant tracking systems

## How Does This Tool Analyze Your CV

This tool will evaluate your CV on 12 important areas that recruiters typically look for:

1. **First Impressions** - How your CV looks at first glance
2. **Contact Details** - Is your contact information complete and professional?
3. **Skills Section** - Are your skills relevant and well-presented?
4. **Professional Summary** - Does your summary grab attention and showcase value?
5. **Work Experience** - Is your experience clearly described and relevant?
6. **Achievements** - Do you highlight measurable accomplishments?
7. **Education & Certifications** - Is your educational background well-presented?
8. **Activities & Leadership** - Do you show involvement beyond work?
9. **Writing Quality** - Is your CV free of errors and well-formatted?
10. **Additional Sections** - Portfolio, languages, interests that add value
11. **Keywords** - Will your CV get past automated screening systems?
12. **Career Direction** - Recommendations for your career path

## Getting Started

### What You'll Need

- Node.js 18 or newer
- An OpenAI API key (you can get one from OpenAI's website)

### Setting Up the Project

1. **Install the required packages**
   ```bash
   npm install
   ```

2. **Set up your environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Open the `.env.local` file and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your-actual-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser and go to**
   ```
   http://localhost:3000
   ```

## Cost Information

Using this tool will consume OpenAI API credits:
- **gpt-4o-mini**: About $0.01-0.03 per CV analysis (recommended for most users)
- **gpt-4**: About $0.10-0.30 per CV analysis (more detailed but pricier)

## Privacy & Your Data

We take your privacy seriously:
- Your CV is processed locally in your browser when possible
- We don't store your CV files on our servers
- Only the extracted text is sent to OpenAI for analysis
- No personal data is kept after the analysis is complete
