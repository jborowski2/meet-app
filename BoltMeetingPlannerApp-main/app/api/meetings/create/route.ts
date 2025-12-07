import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateUniqueLink } from '@/lib/generate-link';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, organizer_name, time_options, location_options } = body;

    console.log('Creating meeting:', { title, organizer_name, time_options, location_options });

    if (!title || !organizer_name) {
      return NextResponse.json(
        { error: 'Title and organizer name are required' },
        { status: 400 }
      );
    }

    const uniqueLink = generateUniqueLink();
    console.log('Generated unique link:', uniqueLink);

    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        unique_link: uniqueLink,
        title,
        description: description || '',
        organizer_name,
      })
      .select()
      .single();

    if (meetingError) {
      console.error('Meeting insert error:', meetingError);
      throw meetingError;
    }

    console.log('Meeting created successfully:', meeting);

    if (time_options && time_options.length > 0) {
      const timeOptionsData = time_options.map((datetime: string) => ({
        meeting_id: meeting.id,
        datetime,
      }));

      const { error: timeError } = await supabase
        .from('time_options')
        .insert(timeOptionsData);

      if (timeError) throw timeError;
    }

    if (location_options && location_options.length > 0) {
      const locationOptionsData = location_options.map((location: string) => ({
        meeting_id: meeting.id,
        location,
      }));

      const { error: locationError } = await supabase
        .from('location_options')
        .insert(locationOptionsData);

      if (locationError) throw locationError;
    }

    return NextResponse.json({ meeting, uniqueLink });
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting' },
      { status: 500 }
    );
  }
}
