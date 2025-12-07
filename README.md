# Kiedy/gdzie spotkanie? 🗓️

A modern, AI-powered meeting planning application built with Next.js, React, TypeScript, and Supabase. This application allows users to create meeting polls, gather availability preferences, and analyze results - all without requiring user authentication.

## Features

- **No Authentication Required**: Share a unique link with participants - no login needed
- **Meeting Creation**: Create polls with multiple date and location options
- **AI-Powered Suggestions**: Get intelligent recommendations for dates, locations, and meeting times
- **Real-time Voting**: Participants can vote with "Yes", "Maybe", or "No" options
- **Visual Results Dashboard**: Beautiful charts and graphs showing voting results
- **Organizer Controls**: Edit, delete, and share meeting polls
- **AI-Generated Invitations**: Automatically create invitation text to share with participants
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: Supabase (PostgreSQL)
- **AI Integration**: OpenAI API (optional)
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- OpenAI API key (optional, falls back to default suggestions)

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd kiedy-gdzie-spotkanie
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. The database schema has already been created via migration
3. Copy your Supabase URL and anon key

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration (Optional)
OPENAI_API_KEY=your_openai_api_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Note**: The OpenAI API key is optional. If not provided, the app will use default suggestions instead of AI-generated ones.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses the following database tables:

- **meetings**: Stores meeting information and metadata
- **time_options**: Stores proposed meeting times
- **location_options**: Stores proposed meeting locations
- **votes**: Stores participant votes for times and locations

All tables have Row Level Security (RLS) enabled with public read/write access (as this is a no-auth application).

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `OPENAI_API_KEY` (optional)
   - `NEXT_PUBLIC_APP_URL` (your production URL)
4. Deploy!

### Update production URL

After deployment, update `NEXT_PUBLIC_APP_URL` in your Vercel environment variables to your production URL (e.g., `https://your-app.vercel.app`).

## Usage Guide

### For Organizers

1. **Create a Meeting**:
   - Click "Utwórz nową ankietę" on the home page
   - Fill in meeting title, description, and your name
   - Add date/time options or use AI suggestions
   - Add location options or use AI suggestions
   - Click "Utwórz ankietę"

2. **Share the Meeting**:
   - Copy the unique link from the share dialog
   - Use the AI-generated invitation text
   - Share via email, messaging apps, or social media

3. **View Results**:
   - Access the "Wyniki" tab to see voting statistics
   - Use AI recommendations to find the best meeting time
   - View who voted for each option

4. **Manage Meeting**:
   - Delete the meeting if needed
   - Organizer view is accessible via the link with `?organizer=true` parameter

### For Participants

1. **Vote on Options**:
   - Open the shared link
   - Enter your name
   - Vote "Tak" (Yes), "Może" (Maybe), or "Nie" (No) for each option
   - Submit your votes

2. **View Results**:
   - Switch to the "Wyniki" tab to see how others voted
   - Results update in real-time

## AI Features

The application uses OpenAI to provide:

1. **Date Suggestions**: Proposes optimal meeting dates based on the meeting context
2. **Location Suggestions**: Recommends appropriate meeting locations
3. **Best Option Analysis**: Analyzes votes to recommend the best meeting time and location
4. **Invitation Generation**: Creates professional invitation text for participants

If OpenAI API is not configured, the app falls back to sensible default suggestions.

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── ai/suggestions/route.ts    # AI integration endpoint
│   │   ├── meetings/
│   │   │   ├── create/route.ts        # Create meeting
│   │   │   └── [link]/route.ts        # Get/update/delete meeting
│   │   └── votes/route.ts             # Submit votes
│   ├── create/page.tsx                 # Meeting creation page
│   ├── meeting/[link]/page.tsx         # Voting and results page
│   ├── page.tsx                        # Home page
│   ├── layout.tsx                      # Root layout
│   └── globals.css                     # Global styles
├── components/ui/                      # shadcn/ui components
├── lib/
│   ├── supabase.ts                    # Supabase client and types
│   ├── generate-link.ts               # Unique link generator
│   └── utils.ts                       # Utility functions
└── public/                            # Static assets
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Your Supabase anonymous key |
| `OPENAI_API_KEY` | No | OpenAI API key for AI features |
| `NEXT_PUBLIC_APP_URL` | Yes | Your app URL (for link generation) |

## Building for Production

```bash
npm run build
npm run start
```

## Type Checking

```bash
npm run typecheck
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues or questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js, React, TypeScript, and Supabase
