import { ZodError } from 'zod';

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { CalendarEvent } from './validations';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error instanceof ZodError) {
    const fieldErrors = error.issues.map(
      (issue) => issue.message
    );
    return fieldErrors.join('. ');
  } else if (
    error.code === '23505'
  ) {
    const constraintName = error.constraint || '';
    if (constraintName.includes('email')) {
      return 'Email already exists';
    }
    return 'Record already exists';
  } else {
    
    return typeof error?.message === 'string'
      ? error.message
      : JSON.stringify(error?.message || error);
  }
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// export const getInitialState = (): Omit<CalendarEvent, "uid"> => {
  
//   const now = new Date();
  
//   now.setSeconds(0, 0);
//   const start = new Date(now);
//   const end = new Date(start.getTime() + 60 * 60 * 1000);

//   return {
//     type: "VEVENT",
//     summary: "",
//     location: "",
//     description: "",
//     dtstart: start,
//     dtend: end,
//     status: "CONFIRMED",
//     class: "PUBLIC",
//     transp: "OPAQUE",
//     priority: null,
//     organizer: "",
//     categories: [],
//     resources: [],
//     url: "",
//     contact: "",
//     geoLat: "",
//     geoLon: "",
//     percentComplete: 0,
//     due: null,
//     completed: null,
//     timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//     rrule: null,
//   };
// };

export const formatInTimezone = (date: Date, timeZone: string) => {
  try {
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);

    const find = (type: string) =>
      parts.find((p) => p.type === type)?.value || "";

    // Handle 24:00 case from Intl.DateTimeFormat by converting to 00
    const hour = find("hour") === "24" ? "00" : find("hour").padStart(2, "0");

    return {
      datePart: `${find("year")}-${find("month")}-${find("day")}`,
      timePart: `${hour}:${find("minute")}`,
    };
  } catch (e) {
    // Invalid timezone might be passed during initial load
    console.warn(`Invalid timezone for formatting: ${timeZone}`, e);
    return { datePart: "", timePart: "" };
  }
};