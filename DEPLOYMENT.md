# Deployment Guide for Kiedy/gdzie spotkanie?

This guide will walk you through deploying your meeting planning application to Vercel with Supabase as the database.

## Prerequisites

- GitHub account
- Vercel account (free tier works)
- Supabase account (free tier works)
- OpenAI API key (optional, for AI features)

## Step 1: Set up Supabase

### 1.1 Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the project details:
   - **Name**: kiedy-gdzie-spotkanie (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose the closest region to your users
4. Wait for the project to be created (2-3 minutes)

### 1.2 Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the "Settings" icon (gear)
2. Navigate to "API" in the left sidebar
3. You'll need these values:
   - **Project URL** (under "Configuration" → "URL")
   - **Anon/Public Key** (under "Project API keys" → "anon public")

Save these values - you'll need them for Vercel configuration.

### 1.3 Verify Database Schema

The database schema has already been applied via migration. To verify:

1. Go to "Table Editor" in the left sidebar
2. You should see the following tables:
   - `meetings`
   - `time_options`
   - `location_options`
   - `votes`

If these tables don't exist, the migration was not applied. Contact support or check the migration file.

## Step 2: Prepare Your Repository

### 2.1 Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit: Meeting planning application"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Step 3: Deploy to Vercel

### 3.1 Import Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the repository you just pushed

### 3.2 Configure Environment Variables

In the "Environment Variables" section, add the following:

**Required Variables:**

```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-project-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

**Optional Variables (for AI features):**

```
OPENAI_API_KEY=<your-openai-api-key>
```

**Note**: Leave `NEXT_PUBLIC_APP_URL` as a placeholder for now. We'll update it after the first deployment.

### 3.3 Deploy

1. Click "Deploy"
2. Wait for the deployment to complete (2-5 minutes)
3. Once deployed, copy your production URL (e.g., `https://your-project.vercel.app`)

### 3.4 Update App URL

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Edit `NEXT_PUBLIC_APP_URL` and set it to your production URL
4. Redeploy the project:
   - Go to "Deployments" tab
   - Click the three dots (...) on the latest deployment
   - Click "Redeploy"

## Step 4: Get OpenAI API Key (Optional)

If you want AI-powered suggestions:

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign in or create an account
3. Navigate to "API Keys"
4. Click "Create new secret key"
5. Copy the key immediately (you won't be able to see it again)
6. Add it to your Vercel environment variables as `OPENAI_API_KEY`
7. Redeploy your application

**Note**: Without the OpenAI API key, the app will use default suggestions instead.

## Step 5: Test Your Deployment

1. Visit your production URL
2. Test the complete flow:
   - Create a new meeting poll
   - Get the shareable link
   - Vote on options (open in incognito/private window to test as participant)
   - View results
   - Test AI suggestions (if configured)

## Step 6: Custom Domain (Optional)

To add a custom domain:

1. In your Vercel project settings, go to "Domains"
2. Add your domain name
3. Follow the DNS configuration instructions
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain
5. Redeploy

## Troubleshooting

### Database Connection Issues

**Problem**: "Meeting not found" or database errors

**Solutions**:
- Verify Supabase credentials in environment variables
- Check that all tables exist in Supabase Table Editor
- Verify RLS policies are enabled

### Build Failures

**Problem**: Build fails on Vercel

**Solutions**:
- Check build logs for specific errors
- Verify all dependencies are in package.json
- Try running `npm run build` locally first

### AI Suggestions Not Working

**Problem**: Getting default suggestions instead of AI-generated ones

**Solutions**:
- Verify `OPENAI_API_KEY` is set in environment variables
- Check OpenAI API key is valid and has credits
- Check server logs for API errors

### Voting Not Saving

**Problem**: Votes disappear after submission

**Solutions**:
- Check Supabase RLS policies allow public INSERT on votes table
- Verify network connectivity to Supabase
- Check browser console for errors

## Monitoring and Maintenance

### Monitor Usage

**Vercel:**
- Check analytics in Vercel dashboard
- Monitor function invocations and bandwidth

**Supabase:**
- Monitor database size in Supabase dashboard
- Check API request count
- Free tier: 500MB database, 2GB bandwidth/month

**OpenAI:**
- Monitor API usage at platform.openai.com
- Set usage limits to avoid unexpected charges

### Database Maintenance

The application doesn't include automatic cleanup. Consider:
- Periodically archiving old meetings
- Setting up a cleanup script for completed meetings
- Monitoring database growth

## Scaling Considerations

### Free Tier Limits

**Vercel (Hobby):**
- Unlimited personal projects
- 100GB bandwidth/month
- Serverless function execution: 100 hours/month

**Supabase (Free):**
- 500MB database
- 2GB bandwidth
- 50,000 monthly active users

**OpenAI:**
- Pay-as-you-go pricing
- ~$0.002 per 1K tokens

### When to Upgrade

Consider upgrading when you hit:
- 5,000+ monthly active users
- 400MB+ database size
- 80GB+ bandwidth/month
- Need priority support

## Security Best Practices

1. **Never commit** `.env.local` or expose API keys
2. **Rotate** Supabase keys if exposed
3. **Monitor** for unusual database activity
4. **Set** OpenAI spending limits
5. **Enable** 2FA on Vercel and Supabase accounts

## Support

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **OpenAI**: [help.openai.com](https://help.openai.com)

## Rollback

If something goes wrong:

1. Go to Vercel → Deployments
2. Find a working deployment
3. Click "..." → "Promote to Production"

## Continuous Deployment

Every push to your `main` branch will automatically trigger a new deployment. To disable this:

1. Go to project Settings → Git
2. Uncheck "Production Branch"

---

Congratulations! Your meeting planning app is now live. 🎉
