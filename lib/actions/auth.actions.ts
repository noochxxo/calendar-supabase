"use server";

import { redirect } from "next/navigation";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import {
  signInFormSchema,
  signUpFormSchema,
} from "@/lib/validations/auth.validations";
import { UserService } from "@/lib/services/user.service";
import { insertCalendarSchema, insertUserSchema } from "@/lib/validations";
import { formatError } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";
import { CalendarService } from "@/lib/services/calendar.service";

export async function signInWithCredentials(
  prevState: unknown,
  formData: FormData
) {
  try {
    const userData = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Invalid email or password",
        userEmail: userData.email,
      };
    }

    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error) || "Invalid email or password",
    };
  }
}

export async function signOutUser() {
  try {
    const supabase = await createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: error.message };
    }
    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return { success: false, message: "Failed to sign out" };
  }
}

export async function signUpUser(prevState: unknown, formData: FormData) {
  console.log(formData);
  try {
    const userData = signUpFormSchema.parse({
      username: formData.get("username"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          username: userData.username,
        },
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || "Failed to create account",
        userEmail: userData.email,
        userName: userData.username,
      };
    }

    if (data.user) {
      console.log(userData);
      try {
        const dbUserData = insertUserSchema.parse({
          supabaseUserId: data.user.id,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
        });

        const dbUser = await UserService.createUser(dbUserData);
        console.log("Database user created", dbUser.id);

        try {
          const defaultCalendarData = insertCalendarSchema.parse({
            userId: dbUser!.id,
            name: "My Calendar",
            description: "Your default calendar",
            color: "#3b82f6",
            timezone: "UTC", // TODO: Detect Timezone
            isDefault: true,
            isVisible: true,
            calendarType: "personal",
            syncEnabled: false,
          });

          const defaultCalendar = await CalendarService.createCalendar(
            defaultCalendarData
          );
          console.log("Default calendar created", defaultCalendar.id);

          
        } catch (calendarError) {
          console.error("Failed to create default calendar:", calendarError);
          // TODO: Rollback creation
        }
      } catch (dbError) {
        console.error("Failed to create database user:", dbError);

        await supabase.auth.admin.deleteUser(data.user.id);

        return {
          success: false,
          message:
            "Account not created. Failed to save user data. Please contact support.",
          userEmail: userData.email,
          userName: userData.username,
        };
      }
    }

    // Check if user needs to confirm email
    if (data.user && !data.session) {
      return {
        success: true,
        message: "Check your email to confirm your account",
      };
    }

    // If auto-confirmed, redirect to dashboard
    if (data.session) {
      redirect("/");
    }

    return {
      success: true,
      message: "Account created successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error) || "Failed to create account",
      userName: formData.get("username")?.toString(),
      userEmail: formData.get("email")?.toString(),
    };
  }
}

export async function resetPassword(prevState: unknown, formData: FormData) {
  try {
    const email = formData.get("email") as string;

    if (!email) {
      return { success: false, message: "Email is required" };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Check your email for password reset instructions",
    };
  } catch (error) {
    return {
      success: false,
      message: formatError(error) || "Failed to send reset email",
    };
  }
}

export async function updatePassword(prevState: unknown, formData: FormData) {
  try {
    const password = formData.get("password") as string;

    if (!password || password.length < 6) {
      return {
        success: false,
        message: "Password must be at least 6 characters",
      };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    redirect("/");
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    return {
      success: false,
      message: formatError(error) || "Failed to update password",
    };
  }
}
