import { db } from "@/db";
import { createClient } from "@/lib/supabase/server";
import { eq } from "drizzle-orm";
import { users } from '@/db/schema';

export class UserService {
  // Get current authenticated user from database
  static async getCurrentUser() {
    const supabase = await createClient();
    
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !authUser) {
      console.error('Auth error:', authError);
      return null;
    }

    try {
      // Get user from database using Supabase user ID
      const dbUser = await db.query.users.findFirst({
        where: eq(users.supabaseUserId, authUser.id),
      });

      if (!dbUser) {
        return null;
      }

      return {
        ...dbUser,
        role: authUser.role || 'user',
      };
    } catch (dbError) {
      console.error('Database error:', dbError);
      return null;
    }
  }

  // Create new user (typically called during sign-up)
  static async createUser(userData: typeof users.$inferInsert) {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  // Get user by username
  static async getUserByUsername(username: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.username, username),
    });
    return user;
  }

  // Get user by Supabase user ID
  static async getUserBySupabaseId(supabaseUserId: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.supabaseUserId, supabaseUserId),
    });
    return user;
  }

  // Helper: Get tiers user can access
  private static getTierAccess(userSubscriptionTier: string): string[] {
    switch (userSubscriptionTier) {
      case 'premium_monthly':
      case 'premium_yearly':
        return ['basic', 'premium'];
      case 'basic_monthly':
      case 'basic_yearly':
        return ['basic'];
      default:
        return []; // No access
    }
  }
}