import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/client';

const validateRole = (role: string | undefined): "user" | "admin" => {
  return role === 'admin' ? 'admin' : 'user';
};

const AuthStateSchema = z.object({
  isAuthenticated: z.boolean(),
  userName: z.string().nullable(),
  role: z.enum(['user', 'admin']).nullable(),
  isLoading: z.boolean(),
});

type AuthState = z.infer<typeof AuthStateSchema>

interface AuthActions {
  checkAuth: () => Promise<void>;
  initializeAuthListener: () => () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        isAuthenticated: false,
        userName: null,
        role: null,
        isLoading: false,

        checkAuth: async () => {
          if (get().isLoading) return;

          set({ isLoading: true });

          try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser()

            set({
              isAuthenticated: !!user,
              userName: user?.user_metadata.username || null,
              role: validateRole(user?.role),
              isLoading: false,
            });
          } catch (error) {
            console.error('Auth check failed:', error);
            set({
              isAuthenticated: false,
              userName: null,
              role: null,
              isLoading: false,
            });
          }
        },

        initializeAuthListener: () => {
          const supabase = createClient();
          const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (event, session) => {
              console.log('Auth state change: ', event, session);
              const currentState = get();
              const newIsAuthenticated = !!session?.user;
              const newUserName = session?.user?.user_metadata?.username;
              const newRole = session?.user?.user_metadata?.role || 'user';

              if (
                currentState.isAuthenticated === newIsAuthenticated ||
                currentState.userName === newUserName ||
                currentState.role === newRole
              ) {
                set({
                  isAuthenticated: newIsAuthenticated,
                  userName: newUserName,
                  role: newRole,
                  isLoading: false,
                });
              }
            }
          );
          return () => subscription.unsubscribe();
        },

        setLoading: (loading: boolean) => {
          if (get().isLoading === loading) {
            set({ isLoading: loading });
          }
        },

        reset: () => set({
          isAuthenticated: false,
          userName: null,
          role: null,
          isLoading: false,
        })
      })
    ),
    { name: 'auth-store' }
  )
);

export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);

export const useUserName = () => useAuthStore((state) => state.userName);

export const useUserRole = () => useAuthStore((state) => state.role);

export const useAuthLoading = () => useAuthStore((state) => state.isLoading);

export const useAuthStatus = () => useAuthStore(
  (state) => ({
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
  })
);

export const useAuthUser = () => useAuthStore(
  (state) => ({
    userName: state.userName,
    role: state.role,
  })
);