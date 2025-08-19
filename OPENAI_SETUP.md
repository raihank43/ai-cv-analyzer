# 🔑 Setup OpenAI API Key

Untuk menggunakan fitur AI analysis, Anda perlu setup OpenAI API key.

## 📝 Langkah-langkah Setup

### 1. Dapatkan OpenAI API Key

1. Kunjungi [OpenAI Platform](https://platform.openai.com/)
2. Login atau buat akun baru
3. Pergi ke [API Keys](https://platform.openai.com/api-keys)
4. Klik **"Create new secret key"**
5. Copy API key yang dibuat (dimulai dengan `sk-`)

### 2. Setup Environment Variable

1. Di root folder project, copy file `.env.example` ke `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Buka file `.env.local` dan edit:
   ```env
   OPENAI_API_KEY=sk-your-actual-openai-api-key-here
   OPENAI_MODEL=gpt-4o-mini
   ```

3. Ganti `sk-your-actual-openai-api-key-here` dengan API key Anda

### 3. Restart Development Server

```bash
npm run dev
```

## 💰 Biaya OpenAI

### Model yang Tersedia

| Model | Cost per Analysis | Quality | Recommended |
|-------|-------------------|---------|-------------|
| gpt-4o-mini | $0.01-0.03 | Good | ✅ Yes (Default) |
| gpt-4 | $0.10-0.30 | Excellent | For premium usage |
| gpt-3.5-turbo | $0.005-0.015 | Basic | Budget option |

### Estimasi Penggunaan

- **CV pendek (1-2 halaman)**: ~1,000 tokens
- **CV lengkap (3-4 halaman)**: ~2,000-3,000 tokens
- **CV detail (5+ halaman)**: ~4,000+ tokens

## 🔒 Keamanan

- ✅ API key disimpan di environment variable (aman)
- ✅ Request dibuat server-side (tidak terekspos ke client)
- ✅ Tidak ada CV text yang disimpan di database
- ✅ Semua proses temporary dan secure

## 🛠️ Troubleshooting

### Error: "OpenAI API key not configured"

**Solusi:**
1. Pastikan file `.env.local` ada di root folder
2. Pastikan API key benar dan dimulai dengan `sk-`
3. Restart development server

### Error: "OpenAI API quota exceeded"

**Solusi:**
1. Check usage di [OpenAI Dashboard](https://platform.openai.com/usage)
2. Add billing information di OpenAI account
3. Upgrade plan jika diperlukan

### Error: "Failed to analyze CV"

**Solusi:**
1. Check internet connection
2. Verify API key masih aktif
3. Try again setelah beberapa menit

## 📊 Monitoring Usage

1. Login ke [OpenAI Platform](https://platform.openai.com/)
2. Pergi ke [Usage](https://platform.openai.com/usage)
3. Monitor penggunaan API dan costs

## 🎯 Tips Menghemat Costs

1. **Gunakan gpt-4o-mini** untuk penggunaan sehari-hari
2. **Bersihkan CV text** sebelum analysis (hapus bagian tidak perlu)
3. **Set limits** di OpenAI dashboard untuk kontrol budget
4. **Monitor usage** secara berkala

---

Jika ada pertanyaan atau masalah, silakan check troubleshooting guide atau contact support.
