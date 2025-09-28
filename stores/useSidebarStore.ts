import { create } from 'zustand';
import { devtools, subscribeWithSelector } from 'zustand/middleware';
import { z } from 'zod';

// 1. Define the state schema using Zod
const SidebarStateSchema = z.object({
  isOpen: z.boolean(),
});

// 2. Infer the TypeScript type from the schema
type SidebarState = z.infer<typeof SidebarStateSchema>;

// 3. Define the actions interface
interface SidebarActions {
  openSidebar: () => void;
  closeSidebar: () => void;
  toggleSidebar: () => void;
}

// 4. Create the final store type by combining state and actions
// We'll nest the actions in an 'actions' object for a stable reference.
interface SidebarStore extends SidebarState {
  actions: SidebarActions;
}

// 5. Create the store
export const useSidebarStore = create<SidebarStore>()(
  devtools(
    subscribeWithSelector(
      (set, get) => ({
        // Initial state
        isOpen: false,
        
        // Actions are now nested in their own object
        actions: {
          openSidebar: () => {
            if (!get().isOpen) {
              set({ isOpen: true }, false, 'sidebar/openSidebar');
            }
          },
          closeSidebar: () => {
            if (get().isOpen) {
              set({ isOpen: false }, false, 'sidebar/closeSidebar');
            }
          },
          toggleSidebar: () => {
            set((state) => ({ isOpen: !state.isOpen }), false, 'sidebar/toggleSidebar');
          },
        },
      })
    ),
    { name: 'sidebar-store' } // Name for Redux DevTools
  )
);

// 6. Export custom hooks (selectors) for components to use
export const useIsSidebarOpen = () => useSidebarStore((state) => state.isOpen);

/**
 * Custom hook to select the sidebar actions.
 * This selector returns a stable object reference, preventing re-render warnings.
 */
export const useSidebarActions = () => useSidebarStore((state) => state.actions);