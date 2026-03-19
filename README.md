# AI Suite - Setup Guide

Follow these steps to get your 4-in-1 AI Project Suite running locally or on Vercel.

## 1. Environment Variables
Create a `.env.local` file (one has been prepared for you) and fill in the following:
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From [Google Cloud Console](https://console.cloud.google.com/).
- `NEXT_PUBLIC_SUPABASE_URL` & `NEXT_PUBLIC_SUPABASE_ANON_KEY`: From [Supabase Dashboard](https://supabase.com/).
- `FIRECRAWL_API_KEY`: From [firecrawl.dev](https://www.firecrawl.dev/).
- `AI_API_KEY`: Groq or OpenRouter API key.
- `NEXTAUTH_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`).

## 2. Supabase Table Setup
Run the following SQL in your Supabase SQL Editor to create the necessary tables:

```sql
-- Notes Table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for security
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see/edit their own notes
CREATE POLICY "Users can manage their own notes" 
ON notes FOR ALL 
USING (auth.uid()::text = user_id::text);
```

## 3. Running the Project
```bash
npm install
npm run dev
```

## 4. Features Included
- **AI Resume Maker**: Professional form -> AI Content -> PDF Export.
- **Notes Saver**: Secure Markdown/Text notes with cloud sync.
- **AI YouTube Summariser**: Paste link -> Get AI Summary + Takeaways.
- **Firecrawl AI Jobs**: Scrape job boards -> AI Structured Listing.
