import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { meeting_id, participant_name, votes } = body;

    if (!meeting_id || !participant_name || !votes || votes.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await supabase
      .from('votes')
      .delete()
      .eq('meeting_id', meeting_id)
      .eq('participant_name', participant_name);

    const votesData = votes.map((vote: any) => ({
      meeting_id,
      participant_name,
      time_option_id: vote.time_option_id || null,
      location_option_id: vote.location_option_id || null,
      vote_type: vote.vote_type,
    }));

    const { error: insertError } = await supabase
      .from('votes')
      .insert(votesData);

    if (insertError) throw insertError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error submitting votes:', error);
    return NextResponse.json(
      { error: 'Failed to submit votes' },
      { status: 500 }
    );
  }
}
