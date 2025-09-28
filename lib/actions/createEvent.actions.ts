"use server";

import { revalidatePath } from "next/cache";
import { UserService } from "@/lib/services/user.service";
import { CalendarService } from "@/lib/services/calendar.service";
import { formatError } from "@/lib/utils";
import { insertCalendarEventSchema, CalendarEvent } from "@/lib/validations";
import { z } from "zod";

export type CreateEventActionState = {
  success: boolean;
  message: string;
  errors?: z.core.$ZodIssue[];
  event?: CalendarEvent;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  formValues?: Record<string, any>;
};

export async function createEvent(
  prevState: CreateEventActionState,
  formData: FormData
): Promise<CreateEventActionState> {
  try {
    
    const user = await UserService.getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "Authentication failed. Please sign in.",
      };
    }

    const formValues = Object.fromEntries(formData.entries());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const valuesToValidate: Record<string, any> = { ...formValues };
    if (valuesToValidate.dtstart) {
      valuesToValidate.dtstart = new Date(valuesToValidate.dtstart as string);
    }
    if (valuesToValidate.dtend) {
      valuesToValidate.dtend = new Date(valuesToValidate.dtend as string);
    }

    const validationResult = insertCalendarEventSchema.safeParse(valuesToValidate);

    if (!validationResult.success) {
      return {
        success: false,
        message: "Invalid form data.",
        errors: validationResult.error.issues,
        formValues: formValues,
      };
    }

    const eventData = validationResult.data;

    const userOwnsCalendar = await CalendarService.userOwnsCalendar(
      eventData.calendarId,
      user.id
    );

    if (!userOwnsCalendar) {
      return {
        success: false,
        message: "Authorization failed: You do not own this calendar.",
        formValues: formValues,
      };
    }

    const newEvent = await CalendarService.createEvent(eventData);

    revalidatePath("/calendar");

    return {
      success: true,
      message: "Event created successfully.",
      event: newEvent,
    };

  } catch (error) {
    // 6. Handle unexpected errors
    return {
      success: false,
      message: formatError(error) || "Failed to create event.",
    };
  }
}

