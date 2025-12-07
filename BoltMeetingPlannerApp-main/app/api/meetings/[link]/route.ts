import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(
  request: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    const { link } = params;

    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('*')
      .eq('unique_link', link)
      .single();

    if (meetingError || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    const { data: timeOptions } = await supabase
      .from('time_options')
      .select('*')
      .eq('meeting_id', meeting.id)
      .order('datetime', { ascending: true });

    const { data: locationOptions } = await supabase
      .from('location_options')
      .select('*')
      .eq('meeting_id', meeting.id)
      .order('created_at', { ascending: true });

    const { data: votes } = await supabase
      .from('votes')
      .select('*')
      .eq('meeting_id', meeting.id);

    return NextResponse.json({
      meeting,
      timeOptions: timeOptions || [],
      locationOptions: locationOptions || [],
      votes: votes || [],
    });
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json(
      { error: 'Failed to fetch meeting' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    const { link } = params;
    const body = await request.json();
    const { title, description, time_options, location_options } = body;

    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id')
      .eq('unique_link', link)
      .single();

    if (meetingError || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    const { error: updateError } = await supabase
      .from('meetings')
      .update({
        title,
        description,
        updated_at: new Date().toISOString(),
      })
      .eq('id', meeting.id);

    if (updateError) throw updateError;

    if (time_options) {
      await supabase.from('time_options').delete().eq('meeting_id', meeting.id);

      if (time_options.length > 0) {
        const timeOptionsData = time_options.map((datetime: string) => ({
          meeting_id: meeting.id,
          datetime,
        }));

        await supabase.from('time_options').insert(timeOptionsData);
      }
    }

    if (location_options) {
      await supabase.from('location_options').delete().eq('meeting_id', meeting.id);

      if (location_options.length > 0) {
        const locationOptionsData = location_options.map((location: string) => ({
          meeting_id: meeting.id,
          location,
        }));

        await supabase.from('location_options').insert(locationOptionsData);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to update meeting' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { link: string } }
) {
  try {
    const { link } = params;

    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .select('id')
      .eq('unique_link', link)
      .single();

    if (meetingError || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    const { error: deleteError } = await supabase
      .from('meetings')
      .delete()
      .eq('id', meeting.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { error: 'Failed to delete meeting' },
      { status: 500 }
    );
  }
}
