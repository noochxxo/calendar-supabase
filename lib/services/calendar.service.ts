import { db } from "@/db";
import { eq, and, desc, inArray, asc } from "drizzle-orm";
import { calendars, calendarEvents } from '@/db/schema';
import type { 
  NewCalendar,
  UpdateCalendar,
  NewCalendarEvent,
  UpdateCalendarEvent,
} from '@/lib/validations';

export class CalendarService {

  static async createCalendar(calendarData: NewCalendar) {
    const [calendar] = await db.insert(calendars).values(calendarData).returning();
    return calendar;
  }

  static async getCalendarsByUserId(userId: string) {
    const userCalendars = await db.query.calendars.findMany({
      where: eq(calendars.userId, userId),
      orderBy: [desc(calendars.isDefault), calendars.name],
    });
    return userCalendars;
  }

  static async getCalendarById(calendarId: string, userId: string) {
    const calendar = await db.query.calendars.findFirst({
      where: and(
        eq(calendars.id, calendarId),
        eq(calendars.userId, userId)
      ),
    });
    return calendar;
  }

  static async getDefaultCalendar(userId: string) {
    const defaultCalendar = await db.query.calendars.findFirst({
      where: and(
        eq(calendars.userId, userId),
        eq(calendars.isDefault, true)
      ),
    });
    return defaultCalendar;
  }

  static async updateCalendar(calendarId: string, userId: string, updateData: UpdateCalendar) {
    const [calendar] = await db
      .update(calendars)
      .set({ 
        ...updateData, 
        updatedAt: new Date() 
      })
      .where(and(
        eq(calendars.id, calendarId),
        eq(calendars.userId, userId)
      ))
      .returning();
    return calendar;
  }

  static async deleteCalendar(calendarId: string, userId: string) {
    const [calendar] = await db
      .delete(calendars)
      .where(and(
        eq(calendars.id, calendarId),
        eq(calendars.userId, userId)
      ))
      .returning();
    return calendar;
  }

  static async setDefaultCalendar(calendarId: string, userId: string) {
   
    await db
      .update(calendars)
      .set({ isDefault: false, updatedAt: new Date() })
      .where(eq(calendars.userId, userId));

   
    const [calendar] = await db
      .update(calendars)
      .set({ isDefault: true, updatedAt: new Date() })
      .where(and(
        eq(calendars.id, calendarId),
        eq(calendars.userId, userId)
      ))
      .returning();

    return calendar;
  }

  // static async createEvent(eventData: NewCalendarEvent) {
  //   const [event] = await db.insert(calendarEvents).values(eventData).returning();
  //   return event;
  // }

  static async createEvent(eventData: NewCalendarEvent) {
  const transformedData = {
    ...eventData,
    
    geoLat: eventData.geoLat ? eventData.geoLat.toString() : undefined,
    geoLon: eventData.geoLon ? eventData.geoLon.toString() : undefined,
  };

  const [event] = await db.insert(calendarEvents).values(transformedData).returning();
  return event;
}

  static async getEventsByCalendarId(calendarId: string, userId: string) {
    const calendar = await this.getCalendarById(calendarId, userId);
    if (!calendar) {
      throw new Error('Calendar not found or access denied');
    }

    const events = await db.query.calendarEvents.findMany({
      where: eq(calendarEvents.calendarId, calendarId),
      with: {
        attendees: true,
        alarms: true,
      },
      orderBy: [calendarEvents.dtstart],
    });

    return events;
  }

  // static async getEventsByUserId(userId: string) {
  //   const events = await db.query.calendarEvents.findMany({
  //     where: eq(calendars.userId, userId),
  //     with: {
  //       calendar: true,
  //       attendees: true,
  //       alarms: true,
  //     },
  //     orderBy: [calendarEvents.dtstart],
  //   });

  //   return events;
  // }

//   static async getEventsByUserId(userId: string) {
//   // First get the user's calendars
//   const userCalendars = await this.getCalendarsByUserId(userId);
//   const calendarIds = userCalendars.map(cal => cal.id);

//   if (calendarIds.length === 0) {
//     return [];
//   }

//   // Then get events from those calendars
//   const events = await db.query.calendarEvents.findMany({
//     where: inArray(calendarEvents.calendarId, calendarIds),
//     with: {
//       calendar: true,
//       attendees: true,
//       alarms: true,
//     },
//     orderBy: [calendarEvents.dtstart],
//   });

//   return events;
// }

static async getEventsByUserId(userId: string) {

  const userCalendars = await db.query.calendars.findMany({
    columns: {
      id: true, 
    },
    where: eq(calendars.userId, userId),
  });

  if (userCalendars.length === 0) {
    return [];
  }

  const calendarIds = userCalendars.map(cal => cal.id);

  const events = await db.query.calendarEvents.findMany({
    where: inArray(calendarEvents.calendarId, calendarIds),
    with: {
      calendar: true,
      attendees: true,
      alarms: true,
    },
    orderBy: [asc(calendarEvents.dtstart)],
  });

  return events;
}

  static async getEventById(eventId: string, userId: string) {
    const event = await db.query.calendarEvents.findFirst({
      where: eq(calendarEvents.id, eventId),
      with: {
        calendar: true,
        attendees: true,
        alarms: true,
      },
    });

    if (!event || event.calendar.userId !== userId) {
      return null;
    }

    return event;
  }

  // static async updateEvent(eventId: string, userId: string, updateData: UpdateCalendarEvent) {
  //   // First verify user owns this event
  //   const existingEvent = await this.getEventById(eventId, userId);
  //   if (!existingEvent) {
  //     throw new Error('Event not found or access denied');
  //   }

  //   const [event] = await db
  //     .update(calendarEvents)
  //     .set({ 
  //       ...updateData, 
  //       updatedAt: new Date() 
  //     })
  //     .where(eq(calendarEvents.id, eventId))
  //     .returning();

  //   return event;
  // }

  static async updateEvent(eventId: string, userId: string, updateData: UpdateCalendarEvent) {
  const existingEvent = await this.getEventById(eventId, userId);
  if (!existingEvent) {
    throw new Error('Event not found or access denied');
  }

  
  const { ...dataWithoutId } = updateData;
  
  const transformedData = {
    ...dataWithoutId,
    geoLat: dataWithoutId.geoLat !== undefined ? 
      (dataWithoutId.geoLat === null ? null : dataWithoutId.geoLat.toString()) : 
      undefined,
    geoLon: dataWithoutId.geoLon !== undefined ? 
      (dataWithoutId.geoLon === null ? null : dataWithoutId.geoLon.toString()) : 
      undefined,
  };

  const [event] = await db
    .update(calendarEvents)
    .set({ 
      ...transformedData, 
      updatedAt: new Date() 
    })
    .where(eq(calendarEvents.id, eventId))
    .returning();

  return event;
}

  static async deleteEvent(eventId: string, userId: string) {
    
    const existingEvent = await this.getEventById(eventId, userId);
    if (!existingEvent) {
      throw new Error('Event not found or access denied');
    }

    const [event] = await db
      .delete(calendarEvents)
      .where(eq(calendarEvents.id, eventId))
      .returning();

    return event;
  }

  // static async addAttendee(attendeeData: NewAttendee) {
  //   const [attendee] = await db.insert(attendees).values(attendeeData).returning();
  //   return attendee;
  // }


  static async userOwnsCalendar(calendarId: string, userId: string): Promise<boolean> {
    const calendar = await db.query.calendars.findFirst({
      where: and(
        eq(calendars.id, calendarId),
        eq(calendars.userId, userId)
      ),
    });
    return !!calendar;
  }

  static async getCalendarWithEvents(calendarId: string, userId: string) {
    const calendar = await db.query.calendars.findFirst({
      where: and(
        eq(calendars.id, calendarId),
        eq(calendars.userId, userId)
      ),
      with: {
        events: {
          with: {
            attendees: true,
            alarms: true,
          },
        },
      },
    });

    return calendar;
  }
}