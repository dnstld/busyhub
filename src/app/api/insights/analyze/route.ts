import { analysisCache } from '@/lib/analysis-cache';
import { auth } from '@/lib/auth';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Get user session for user-specific caching
    const session = await auth();
    const userEmail = session?.user?.email || undefined;

    // Check if we have a cached response
    const cachedData = analysisCache.get(prompt, userEmail);
    if (cachedData) {
      const cacheAgeHours = Math.round((Date.now() - cachedData.timestamp) / (1000 * 60 * 60));
      return NextResponse.json({ 
        analysis: cachedData.analysis,
        usage: cachedData.usage,
        cached: true,
        cacheAge: cacheAgeHours
      });
    }

    // If not cached or expired, generate new analysis
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const analysis = response.choices[0]?.message?.content;

    if (!analysis) {
      return NextResponse.json(
        { error: 'No analysis generated' },
        { status: 500 }
      );
    }

    // Store in cache
    analysisCache.set(prompt, analysis, response.usage, userEmail);

    return NextResponse.json({ 
      analysis,
      usage: response.usage,
      cached: false
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: 'Failed to generate analysis', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
