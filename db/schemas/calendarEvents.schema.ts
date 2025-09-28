import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
  jsonb,
  decimal,
} from 'drizzle-orm/pg-core';
import { calendars} from './calendar.schema';

export const calendarEvents = pgTable('calendar_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  calendarId: uuid('calendar_id').notNull().references(() => calendars.id, { onDelete: 'cascade' }),
  uid: varchar('uid', { length: 255 }).notNull().unique(),
  type: varchar('type', { length: 20 }).notNull().default('VEVENT'),
  summary: text('summary'),
  description: text('description'),
  location: text('location'),
  status: varchar('status', { length: 50 }),
  dtstart: timestamp('dtstart', { withTimezone: true }),
  dtend: timestamp('dtend', { withTimezone: true }),
  duration: varchar('duration', { length: 100 }),
  dtstamp: timestamp('dtstamp', { withTimezone: true }),
  created: timestamp('created', { withTimezone: true }).defaultNow(),
  lastModified: timestamp('last_modified', { withTimezone: true }).defaultNow(),
  sequence: integer('sequence').default(0),
  priority: integer('priority'),
  class: varchar('class', { length: 50 }),
  transp: varchar('transp', { length: 50 }),
  organizer: varchar('organizer', { length: 255 }),
  categories: jsonb('categories').$type<string[]>(),
  rrule: text('rrule'),
  exdate: jsonb('exdate').$type<Date[]>(),
  rdate: jsonb('rdate').$type<Date[]>(),
  geoLat: decimal('geo_lat', { precision: 10, scale: 8 }),
  geoLon: decimal('geo_lon', { precision: 11, scale: 8 }),
  resources: jsonb('resources').$type<string[]>(),
  url: text('url'),
  contact: text('contact'),
  percentComplete: integer('percent_complete'),
  completed: timestamp('completed', { withTimezone: true }),
  due: timestamp('due', { withTimezone: true }),
  relatedTo: varchar('related_to', { length: 255 }),
  freebusy: jsonb('freebusy').$type<{
    type: string;
    start: Date;
    end: Date;
  }[]>(),
  customProperties: jsonb('custom_properties').$type<Record<string, string>>(),
  timezone: varchar('timezone', { length: 100 }),
  isOccurrence: boolean('is_occurrence').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const attendees = pgTable('attendees', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => calendarEvents.id, { onDelete: 'cascade' }),
  cn: varchar('cn', { length: 255 }),
  role: varchar('role', { length: 50 }),
  partstat: varchar('partstat', { length: 50 }),
  rsvp: boolean('rsvp'),
  cutype: varchar('cutype', { length: 50 }),
  delegatedTo: varchar('delegated_to', { length: 255 }),
  delegatedFrom: varchar('delegated_from', { length: 255 }),
  email: varchar('email', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const alarms = pgTable('alarms', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventId: uuid('event_id').notNull().references(() => calendarEvents.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 50 }).notNull(),
  trigger: text('trigger').notNull(),
  description: text('description'),
  summary: text('summary'),
  attendee: varchar('attendee', { length: 255 }),
  attach: text('attach'),
  repeat: integer('repeat'),
  duration: varchar('duration', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const attendeesRelations = relations(attendees, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [attendees.eventId],
    references: [calendarEvents.id],
  }),
}));

export const calendarEventsRelations = relations(calendarEvents, ({ one, many }) => ({
  calendar: one(calendars, {
    fields: [calendarEvents.calendarId],
    references: [calendars.id],
  }),
  attendees: many(attendees),
  alarms: many(alarms),
}));

export const alarmsRelations = relations(alarms, ({ one }) => ({
  event: one(calendarEvents, {
    fields: [alarms.eventId],
    references: [calendarEvents.id],
  }),
}));