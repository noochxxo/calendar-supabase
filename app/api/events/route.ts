import { NextRequest, NextResponse } from "next/server";
import { UserService } from "@/lib/services/user.service";
import { CalendarService } from "@/lib/services/calendar.service";
import { formatError } from "@/lib/utils";
import { insertCalendarEventSchema } from "@/lib/validations";

export async function GET(_request: NextRequest) {
  try {
    const currentUser = await UserService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const events = await CalendarService.getEventsByUserId(currentUser.id);
    return NextResponse.json(events );

  } catch (error) {
    console.error("Failed to fetch events:", error);
    return NextResponse.json({ 
        error: 'Failed to fetch events',
        details: formatError(error) 
      }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await UserService.getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const eventData = insertCalendarEventSchema.parse(body);

    const newEvent = await CalendarService.createEvent(eventData);
    return NextResponse.json({ event: newEvent }, { status: 201 });

  } catch (error) {
    // This is the corrected block for the new error
    console.error("Failed to create event:", error);
    return NextResponse.json({ 
        error: 'Failed to create event',
        // Use your utility to safely get the message
        details: formatError(error) 
      }, { status: 500 });
  }
}


