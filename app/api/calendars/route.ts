import { NextResponse } from 'next/server';
import { CalendarService } from '@/lib/services/calendar.service';
import { UserService } from '@/lib/services/user.service';

export async function GET() {
  try {
    const currentUser = await UserService.getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const calendars = await CalendarService.getCalendarsByUserId(currentUser.id);
    return NextResponse.json({ calendars });
  } catch (error) {
    console.error('Error fetching calendars:', error);
    return NextResponse.json({ error: 'Failed to fetch calendars' }, { status: 500 });
  }
}