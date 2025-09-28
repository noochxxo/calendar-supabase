import { create } from "zustand";
import { CalendarEvent } from "@/lib/validations";

const ALL_EVENT_TYPES = ["VEVENT", "VTODO", "VJOURNAL", "VFREEBUSY"];

interface CalendarState {
  events: CalendarEvent[];
  lastEventsState: CalendarEvent[] | null;
  undoMessage: string | null;
  selectedDate: Date | null;
  selectedEvent: CalendarEvent | null;
  editingEvent: CalendarEvent | null;
  deletingEvent: CalendarEvent | null;
  isCreatingEvent: boolean;
  isSyncModalOpen: boolean;
  selectedTypes: string[];
  selectedCategories: string[];
}

interface CalendarActions {
  setEvents: (events: CalendarEvent[]) => void;
  setSelectedDate: (date: Date | null) => void;
  setSelectedEvent: (event: CalendarEvent | null) => void;
  setEditingEvent: (event: CalendarEvent | null) => void;
  setDeletingEvent: (event: CalendarEvent | null) => void;
  setIsCreatingEvent: (isCreating: boolean) => void;
  setIsSyncModalOpen: (isOpen: boolean) => void;
  setSelectedTypes: (types: string[]) => void;
  setSelectedCategories: (categories: string[]) => void;
  dismissUndo: () => void;
  handleUndo: () => void;
  createEvent: (newEventData: Omit<CalendarEvent, "uid">) => void;
  updateEvent: (updatedEvent: CalendarEvent) => void;
  deleteSeries: () => void;
  deleteOccurrence: () => void;
}

const initialState: CalendarState = {
  events: [],
  lastEventsState: null,
  undoMessage: null,
  selectedDate: null,
  selectedEvent: null,
  editingEvent: null,
  deletingEvent: null,
  isCreatingEvent: false,
  isSyncModalOpen: false,
  selectedTypes: ALL_EVENT_TYPES,
  selectedCategories: [],
};

export const useCalendarStore = create<CalendarState & CalendarActions>(
  (set, get) => ({
    ...initialState,

    // --- Basic Setters ---
    setEvents: (events) => set({ events }),
    setSelectedDate: (date) => set({ selectedDate: date, selectedEvent: null }),
    setSelectedEvent: (event) => set({ selectedEvent: event, selectedDate: null }),
    setEditingEvent: (event) => set({ editingEvent: event }),
    setDeletingEvent: (event) => set({ deletingEvent: event }),
    setIsCreatingEvent: (isCreating) => set({ isCreatingEvent: isCreating }),
    setIsSyncModalOpen: (isOpen) => set({ isSyncModalOpen: isOpen }),
    setSelectedTypes: (types) => set({ selectedTypes: types }),
    setSelectedCategories: (categories) => set({ selectedCategories: categories }),

    // --- Undo Logic ---
    dismissUndo: () => set({ lastEventsState: null, undoMessage: null }),
    handleUndo: () => {
      const { lastEventsState } = get();
      if (lastEventsState) {
        set({
          events: lastEventsState,
          lastEventsState: null,
          undoMessage: null,
        });
      }
    },

    // --- Complex Actions ---
    createEvent: (newEventData) => {
      const newEvent: CalendarEvent = {
        ...newEventData,
        uid: `new-event-${Date.now()}`,
        dtstamp: new Date(),
        status:
          newEventData.status ||
          (newEventData.type === "VTODO" ? "NEEDS-ACTION" : "CONFIRMED"),
      };
      set((state) => ({
        lastEventsState: state.events,
        undoMessage: "Event created.",
        events: [...state.events, newEvent],
        isCreatingEvent: false,
      }));
    },

    updateEvent: (updatedEvent) => {
      set((state) => ({
        lastEventsState: state.events,
        undoMessage: "Event updated.",
        events: state.events.map((e) =>
          e.uid === updatedEvent.uid ? updatedEvent : e
        ),
        editingEvent: null,
        selectedEvent:
          state.selectedEvent?.uid === updatedEvent.uid
            ? updatedEvent
            : state.selectedEvent,
      }));
    },

    deleteSeries: () => {
      const { deletingEvent } = get();
      if (deletingEvent) {
        set((state) => ({
          lastEventsState: state.events,
          undoMessage: "Event series deleted.",
          events: state.events.filter((e) => e.uid !== deletingEvent.uid),
          deletingEvent: null,
          selectedEvent: null,
          selectedDate: null,
        }));
      }
    },

    deleteOccurrence: () => {
      const { deletingEvent } = get();
      if (deletingEvent && deletingEvent.dtstart) {
        const occurrenceDate = deletingEvent.dtstart;
        set((state) => ({
          lastEventsState: state.events,
          undoMessage: "Event occurrence deleted.",
          events: state.events.map((e) => {
            if (e.uid === deletingEvent.uid) {
              return {
                ...e,
                exdate: [...(e.exdate || []), occurrenceDate],
              };
            }
            return e;
          }),
          deletingEvent: null,
          selectedEvent: null,
          selectedDate: null,
        }));
      }
    },
  })
);
