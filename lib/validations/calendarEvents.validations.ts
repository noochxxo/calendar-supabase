import { alarms, attendees, calendarEvents } from "@/db/schemas";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import z from "zod";
import { insertCalendarSchema, selectCalendarSchema } from "./calendars.validation";

export const eventTypeSchema = z.enum(['VEVENT', 'VTODO', 'VJOURNAL', 'VFREEBUSY', 'UNKNOWN']);

export const geoSchema = z.object({
  lat: z.number().min(-90).max(90),
  lon: z.number().min(-180).max(180),
});

export const freeBusySchema = z.object({
  type: z.string(),
  start: z.date(),
  end: z.date(),
});

export const insertCalendarEventSchema = createInsertSchema(calendarEvents, {
  calendarId: z.string().uuid(),
  uid: z.string().min(1).max(255),
  type: eventTypeSchema,
  summary: z.string().max(500).optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  status: z.string().max(50).optional(),
  dtstart: z.date().optional(),
  dtend: z.date().optional(),
  duration: z.string().max(100).optional(),
  dtstamp: z.date().optional(),
  sequence: z.number().int().min(0).optional(),
  priority: z.number().int().min(0).max(9).optional(),
  class: z.string().max(50).optional(),
  transp: z.string().max(50).optional(),
  organizer: z.string().email().max(255).optional(),
  categories: z.array(z.string()).optional(),
  rrule: z.string().optional(),
  exdate: z.array(z.date()).optional(),
  rdate: z.array(z.date()).optional(),
  geoLat: z.number().min(-90).max(90).optional(),
  geoLon: z.number().min(-180).max(180).optional(),
  resources: z.array(z.string()).optional(),
  url: z.string().url().optional(),
  contact: z.string().optional(),
  percentComplete: z.number().int().min(0).max(100).optional(),
  completed: z.date().optional(),
  due: z.date().optional(),
  relatedTo: z.string().max(255).optional(),
  freebusy: z.array(freeBusySchema).optional(),
  customProperties: z.record(z.string(), z.string()).optional(),
  timezone: z.string().max(100).optional(),
  isOccurrence: z.boolean().optional(),
}).refine(
  (data) => {
    // If dtend is provided, it should be after dtstart
    if (data.dtstart && data.dtend) {
      return data.dtend > data.dtstart;
    }
    return true;
  },
  {
    message: "End date must be after start date",
    path: ["dtend"],
  }
);

export const insertCalendarWithEventsSchema = insertCalendarSchema.extend({
  events: z.array(insertCalendarEventSchema.omit({ calendarId: true })).optional(),
});

export const selectCalendarEventSchema = createSelectSchema(calendarEvents);
export const updateCalendarEventSchema = insertCalendarEventSchema.partial().extend({
  id: z.string().uuid(),
});

export const selectCalendarWithEventsSchema = selectCalendarSchema.extend({
  events: z.array(selectCalendarEventSchema).optional(),
  user: z.object({
    id: z.string().uuid(),
    username: z.string(),
    email: z.string().email(),
  }).optional(),
});

export const insertAttendeeSchema = createInsertSchema(attendees, {
  eventId: z.string().uuid(),
  cn: z.union([
      z.string(), 
      z.array(z.string()) // It's best practice to specify the array's type
    ]).optional(),
  // role: z.string().optional(),
  role: z.union([
      z.string(), 
      z.array(z.string()) // It's best practice to specify the array's type
    ]).optional(),
  partstat: z.union([
      z.string(), 
      z.array(z.string()) // It's best practice to specify the array's type
    ]).optional(),
  rsvp: z.boolean().optional(),
  cutype: z.union([
      z.string(), 
      z.array(z.string()) // It's best practice to specify the array's type
    ]).optional(),
  delegatedTo: z.union([
      z.string(), 
      z.array(z.string()) // It's best practice to specify the array's type
    ]).optional(),
  delegatedFrom: z.union([
      z.string(), 
      z.array(z.string()) // It's best practice to specify the array's type
    ]).optional(),
  email: z.string().email().max(255),
});

export const selectAttendeeSchema = createSelectSchema(attendees);
export const updateAttendeeSchema = insertAttendeeSchema.partial().extend({
  id: z.string().uuid(),
});

export const insertAlarmSchema = createInsertSchema(alarms, {
  eventId: z.string().uuid(),
  // action: z.enum(['AUDIO', 'DISPLAY', 'EMAIL', 'PROCEDURE']),
  action: z.string(),
  trigger: z.string().min(1),
  description: z.string().optional(),
  summary: z.string().max(500).optional(),
  attendee: z.string().email().max(255).optional(),
  attach: z.string().url().optional(),
  repeat: z.number().int().min(0).optional(),
  duration: z.string().max(100).optional(),
});

export const selectAlarmSchema = createSelectSchema(alarms);
export const updateAlarmSchema = insertAlarmSchema.partial().extend({
  id: z.string().uuid(),
});

// TODO: fix error
// export const insertEventWithAttendeesSchema = insertCalendarEventSchema.and({
//   attendees: z.array(insertAttendeeSchema.omit({ eventId: true })).optional(),
//   alarms: z.array(insertAlarmSchema.omit({ eventId: true })).optional(),
// });

export const selectEventWithRelationsSchema = selectCalendarEventSchema.extend({
  calendar: selectCalendarSchema.optional(),
  attendees: z.array(selectAttendeeSchema).optional(),
  alarms: z.array(selectAlarmSchema).optional(),
  geo: z.object({
    lat: z.number(),
    lon: z.number(),
  }).optional(),
});

export type CalendarWithEvents = z.infer<typeof selectCalendarWithEventsSchema>;
export type NewCalendarWithEvents = z.infer<typeof insertCalendarWithEventsSchema>;

export type CalendarEvent = z.infer<typeof selectCalendarEventSchema>;
export type NewCalendarEvent = z.infer<typeof insertCalendarEventSchema>;
export type UpdateCalendarEvent = z.infer<typeof updateCalendarEventSchema>;

export type Attendee = z.infer<typeof selectAttendeeSchema>;
export type NewAttendee = z.infer<typeof insertAttendeeSchema>;
export type UpdateAttendee = z.infer<typeof updateAttendeeSchema>;

export type Alarm = z.infer<typeof selectAlarmSchema>;
export type NewAlarm = z.infer<typeof insertAlarmSchema>;
export type UpdateAlarm = z.infer<typeof updateAlarmSchema>;

export type EventWithRelations = z.infer<typeof selectEventWithRelationsSchema>;
// export type NewEventWithAttendees = z.infer<typeof insertEventWithAttendeesSchema>;

export const transformGeoCoordinates = (event: CalendarEvent & { geoLat?: string | null; geoLon?: string | null }) => {
  if (event.geoLat && event.geoLon) {
    return {
      ...event,
      geo: {
        lat: parseFloat(event.geoLat),
        lon: parseFloat(event.geoLon),
      },
    };
  }
  return event;
};