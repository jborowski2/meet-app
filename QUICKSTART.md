# Quick Start Guide

Get your meeting planning app running locally in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- npm or yarn
- A Supabase account (free)

## Step 1: Clone and Install

```bash
# Install dependencies
npm install
```

## Step 2: Set Up Supabase

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for the database to be ready (2-3 minutes)
4. The database schema has already been applied via migration

## Step 3: Get Your Credentials

In your Supabase project:

1. Go to Settings → API
2. Copy your **Project URL**
3. Copy your **anon/public key**

## Step 4: Configure Environment

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Optional** - Add OpenAI for AI features:
```env
OPENAI_API_KEY=your_openai_key_here
```

## Step 5: Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 6: Test It Out

1. Click "Utwórz nową ankietę" (Create new poll)
2. Fill in meeting details
3. Try the AI suggestions (if OpenAI is configured)
4. Add some date/time and location options
5. Create the meeting
6. Copy the link and open it in an incognito window
7. Vote as a participant
8. View the results

## What's Next?

- Read the [README.md](README.md) for detailed documentation
- Check [DEPLOYMENT.md](DEPLOYMENT.md) to deploy to production
- Customize the design in `app/globals.css`
- Add more features as needed

## Common Issues

### "Meeting not found" error
- Check your Supabase credentials in `.env.local`
- Verify the database tables exist in Supabase Table Editor

### AI suggestions not working
- Verify `OPENAI_API_KEY` is set (optional)
- Check the console for error messages
- Default suggestions will be used if OpenAI is not configured

### Build fails
```bash
# Clean build
rm -rf .next
npm run build
```

## Need Help?

- Check the full [README.md](README.md)
- Review [DEPLOYMENT.md](DEPLOYMENT.md)
- Check Supabase and Vercel documentation

---

Happy coding! 🚀
