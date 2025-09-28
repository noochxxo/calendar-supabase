import { calendars } from "@/db/schemas";
import z from "zod";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const insertCalendarSchema = createInsertSchema(calendars, {
  userId: z.string().uuid(),
  name: z.string().min(1).max(255),
  description: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color").optional(),
  timezone: z.string().max(100).optional(),
  isDefault: z.boolean().optional(),
  isVisible: z.boolean().optional(),
  calendarType: z.enum(['personal', 'work', 'shared', 'family', 'other']).optional(),
  externalId: z.string().max(255).optional(),
  externalSource: z.enum(['google', 'outlook', 'caldav', 'ical', 'other']).optional(),
  syncEnabled: z.boolean().optional(),
  lastSyncAt: z.date().optional(),
});

export const selectCalendarSchema = createSelectSchema(calendars);
export const updateCalendarSchema = insertCalendarSchema.partial().extend({
  id: z.string().uuid(),
});

export type Calendar = z.infer<typeof selectCalendarSchema>;
export type NewCalendar = z.infer<typeof insertCalendarSchema>;
export type UpdateCalendar = z.infer<typeof updateCalendarSchema>;






