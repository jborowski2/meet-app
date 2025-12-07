import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  let body: any;
  try {
    body = await request.json();
    const { type, context } = body;

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        suggestions: getDefaultSuggestions(type, context),
        isAiGenerated: false,
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant for meeting planning.',
          },
          {
            role: 'user',
            content: generatePrompt(type, context),
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error('OpenAI API request failed');
    }

    const data = await response.json();
    const suggestions = parseSuggestions(data.choices[0].message.content, type);

    return NextResponse.json({ suggestions, isAiGenerated: true });
  } catch (error) {
    console.error('Error generating AI suggestions:', error);
    return NextResponse.json({
      suggestions: getDefaultSuggestions(body?.type || '', body?.context || {}),
      isAiGenerated: false,
    });
  }
}

function generatePrompt(type: string, context: any): string {
  if (type === 'dates') {
    return `Suggest 3 good meeting dates for the next 2 weeks. Consider that the meeting is about: "${context.title}". Return only a JSON array of ISO datetime strings.`;
  } else if (type === 'locations') {
    return `Suggest 3 good meeting locations for: "${context.title}". Consider the context: "${context.description}". Return only a JSON array of location names as strings.`;
  } else if (type === 'best-option') {
    return `Based on these votes: ${JSON.stringify(context.votes)}, suggest the best meeting time and location. Consider 'yes' votes as 3 points, 'maybe' as 1 point, and 'no' as 0 points. Return a brief recommendation in Polish.`;
  } else if (type === 'invitation') {
    return `Generate a friendly invitation message in Polish for a meeting titled "${context.title}" with description "${context.description}". Include the link: ${context.link}. Keep it concise and professional.`;
  }
  return '';
}

function parseSuggestions(content: string, type: string): any {
  try {
    const jsonMatch = content.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error('Failed to parse AI response:', e);
  }
  return getDefaultSuggestions(type, {});
}

function getDefaultSuggestions(type: string, context: any): any {
  if (type === 'dates') {
    const suggestions = [];
    const now = new Date();
    for (let i = 1; i <= 3; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() + i * 3);
      date.setHours(14, 0, 0, 0);
      suggestions.push(date.toISOString());
    }
    return suggestions;
  } else if (type === 'locations') {
    return ['Kawiarnia w centrum', 'Sala konferencyjna', 'Online (Zoom/Meet)'];
  } else if (type === 'best-option') {
    return 'Na podstawie głosów, zalecamy wybranie opcji z największą liczbą głosów "Tak".';
  } else if (type === 'invitation') {
    return `Witaj! Zapraszam Cię do udziału w planowaniu spotkania "${context.title}". Kliknij w link i zagłosuj na swoje preferowane terminy i lokalizacje: ${context.link}`;
  }
  return [];
}
