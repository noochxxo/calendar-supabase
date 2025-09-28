import { CalendarService } from '@/lib/services/calendar.service';
type EventType =  "VEVENT" | "VTODO" | "VJOURNAL" | "VFREEBUSY" | "UNKNOWN"

export async function createSampleEventsForNewUser(userId: string) {
  try {
    // Get or create default calendar
    let defaultCalendar = await CalendarService.getDefaultCalendar(userId);
    
    if (!defaultCalendar) {
      defaultCalendar = await CalendarService.createCalendar({
        userId,
        name: 'My Calendar',
        description: 'Your personal calendar',
        color: '#3b82f6',
        timezone: 'UTC',
        isDefault: true,
        isVisible: true,
        calendarType: 'personal',
        syncEnabled: false,
      });
    }

    // 20 sample events scattered across different days
    const events = [
      // Past week
      { days: -6, hour: 10, title: 'Team Standup', desc: 'Weekly team sync meeting', cat: ['work'] },
      { days: -4, hour: 14, title: 'Doctor Checkup', desc: 'Annual health examination', cat: ['health'] },
      { days: -2, hour: 19, title: 'Family Dinner', desc: 'Weekly family gathering', cat: ['family'] },
      
      // This week
      { days: 0, hour: 9, title: 'Project Kickoff', desc: 'New project planning session', cat: ['work'] },
      { days: 1, hour: 18, title: 'Gym Workout', desc: 'Evening fitness session', cat: ['fitness'] },
      { days: 2, hour: 15, title: 'Dentist Appointment', desc: 'Routine cleaning', cat: ['health'] },
      { days: 3, hour: 12, title: 'Lunch Meeting', desc: 'Client discussion over lunch', cat: ['work'] },
      { days: 4, hour: 20, title: 'Book Club', desc: 'Monthly book discussion', cat: ['social'] },
      
      // Next week
      { days: 7, hour: 11, title: 'Code Review', desc: 'Weekly code review session', cat: ['work'] },
      { days: 8, hour: 16, title: 'Car Service', desc: 'Vehicle maintenance appointment', cat: ['errands'] },
      { days: 9, hour: 13, title: 'Coffee with Sarah', desc: 'Catch up with old friend', cat: ['social'] },
      { days: 10, hour: 17, title: 'Yoga Class', desc: 'Evening yoga session', cat: ['fitness'] },
      { days: 11, hour: 8, title: 'Morning Run', desc: '5K run in the park', cat: ['fitness'] },
      
      // Week 3
      { days: 14, hour: 14, title: 'Client Presentation', desc: 'Quarterly business review', cat: ['work'] },
      { days: 16, hour: 19, title: 'Date Night', desc: 'Movie and dinner', cat: ['personal'] },
      { days: 17, hour: 10, title: 'House Cleaning', desc: 'Deep clean the house', cat: ['home'], type: 'VTODO' },
      { days: 18, hour: 15, title: 'Guitar Lesson', desc: 'Weekly music lesson', cat: ['hobby'] },
      
      // Week 4+
      { days: 21, hour: 9, title: 'Conference Call', desc: 'Monthly all-hands meeting', cat: ['work'] },
      { days: 25, hour: 12, title: 'Birthday Party', desc: 'Friend\'s birthday celebration', cat: ['social'] },
      { days: 28, hour: 11, title: 'Grocery Shopping', desc: 'Weekly grocery run', cat: ['errands'], type: 'VTODO' },
    ];

    // Create the events
    for (const event of events) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + event.days);
      startDate.setHours(event.hour, 0, 0, 0);
      
      const endDate = new Date(startDate);
      endDate.setHours(startDate.getHours() + (event.type === 'VTODO' ? 2 : 1));

      await CalendarService.createEvent({
        calendarId: defaultCalendar.id,
        uid: `sample-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        type: event.type as EventType,
        summary: event.title,
        description: event.desc,
        dtstart: startDate,
        dtend: endDate,
        status: 'CONFIRMED',
        dtstamp: new Date(),
        priority: event.cat.includes('work') ? 2 : 3,
        sequence: 0,
        categories: event.cat,
      });
    }

    console.log(`Created 20 sample events for user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to create sample events:', error);
    return { success: false, error };
  }
}