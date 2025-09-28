import { relations } from 'drizzle-orm';
import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
} from 'drizzle-orm/pg-core';
import { users } from './users.schema';
import { calendarEvents } from './calendarEvents.schema';


export const calendars = pgTable('calendars', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  color: varchar('color', { length: 7 }).default('#3b82f6'), // Hex color code
  timezone: varchar('timezone', { length: 100 }).default('UTC'),
  isDefault: boolean('is_default').default(false),
  isVisible: boolean('is_visible').default(true),
  calendarType: varchar('calendar_type', { length: 50 }).default('personal'), // personal, work, shared, etc.
  externalId: varchar('external_id', { length: 255 }), // For synced calendars (Google, Outlook, etc.)
  externalSource: varchar('external_source', { length: 50 }), // google, outlook, caldav, etc.
  syncEnabled: boolean('sync_enabled').default(false),
  lastSyncAt: timestamp('last_sync_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

export const calendarsRelations = relations(calendars, ({ one, many }) => ({
  user: one(users, {
    fields: [calendars.userId],
    references: [users.id],
  }),
  events: many(calendarEvents),
}));
