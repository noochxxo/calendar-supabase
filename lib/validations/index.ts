
// Re-export all validation schemas
export {
  insertUserSchema,
  selectUserSchema,
  updateUserSchema,
  type User,
  type NewUser,
  type UpdateUser,
} from '@/db/schemas/users.schema';

export {
  insertCalendarSchema,
  selectCalendarSchema,
  updateCalendarSchema,
  
  type Calendar,
  type NewCalendar,
  type UpdateCalendar,
  
} from './calendars.validation';

export {
  insertCalendarEventSchema,
  selectCalendarEventSchema,
  insertCalendarWithEventsSchema,
  selectCalendarWithEventsSchema,
  updateCalendarEventSchema,
  // insertEventWithAttendeesSchema,
  selectEventWithRelationsSchema,
  type CalendarEvent,
  type NewCalendarEvent,
  type CalendarWithEvents,
  type NewCalendarWithEvents,
  type UpdateCalendarEvent,
  type EventWithRelations,
  // type NewEventWithAttendees,
} from './calendarEvents.validations';

export {
  insertAttendeeSchema,
  selectAttendeeSchema,
  updateAttendeeSchema,
  type Attendee,
  type NewAttendee,
  type UpdateAttendee,
} from './calendarEvents.validations';

export {
  insertAlarmSchema,
  selectAlarmSchema,
  updateAlarmSchema,
  type Alarm,
  type NewAlarm,
  type UpdateAlarm,
} from './calendarEvents.validations';

export {
  eventTypeSchema,
  geoSchema,
  freeBusySchema,
  transformGeoCoordinates,
} from './calendarEvents.validations';

export interface FreeBusy {
  type: string;
  start: Date;
  end: Date;
}