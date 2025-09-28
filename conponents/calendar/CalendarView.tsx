'use client'

import { useCalendar } from "@/hooks/useCalendar";
import { useUserName } from "@/stores/useAuthStore";
import { useEffect, useMemo } from "react";
import { FilterDropdown } from "./FilterDropdown";
import { Calendar } from "./Calendar";
import { DayViewModal } from "./DayViewModal";
import { EventDetailModal } from "./EventDetailModal";
import { EditEventModal } from "./EditEventModal";
import { CreateEventModal } from "./CreateEventModal";
import { SyncCalendarModal } from "./SyncCalendarModal";
import { RecurringDeleteModal } from "./RecurringDeleteModal";
import { ConfirmationModal } from "./ConfirmationModal";
import { UndoToast } from "./UndoToast";
import { expandEvents } from "@/lib/services/eventExpander";
import { CreateEventIcon, SyncIcon } from "../icons";
import { useCalendarStore } from "@/stores/useCalendarStore";

const ALL_EVENT_TYPES = ["VEVENT", "VTODO", "VJOURNAL", "VFREEBUSY"];

export const CalendarView = () => {
  const username = useUserName();

  const {
    events,
    lastEventsState,
    undoMessage,
    selectedDate,
    selectedEvent,
    editingEvent,
    deletingEvent,
    isCreatingEvent,
    isSyncModalOpen,
    selectedTypes,
    selectedCategories,
  } = useCalendarStore();

  const {
    setEvents,
    setSelectedDate,
    setSelectedEvent,
    setEditingEvent,
    setDeletingEvent,
    setIsCreatingEvent,
    setIsSyncModalOpen,
    setSelectedTypes,
    setSelectedCategories,
    dismissUndo,
    handleUndo,
    createEvent,
    updateEvent,
    deleteSeries,
    deleteOccurrence,
  } = useCalendarStore();

  const {
    currentDate,
    goToNextMonth,
    goToPreviousMonth,
    goToToday,
    monthName,
    year,
    viewStartDate,
    viewEndDate,
    calendarGrid,
  } = useCalendar(new Date(2025, 8, 15));

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch("/api/events");
      const result = await res.json();
      setEvents(result); 
    }

    fetchEvents();
  }, [setEvents]);

  const allCategories = useMemo(() => {
    const categories = new Set<string>();
    events.forEach((event) => {
      event.categories?.forEach((cat) => categories.add(cat));
    });
    return Array.from(categories).sort();
  }, [events]);

  useEffect(() => {
    if (allCategories.length > 0) {
      setSelectedCategories(allCategories);
    }
  }, [allCategories, setSelectedCategories]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const typeMatch = selectedTypes.includes(event.type);
      const categoryMatch =
        !event.categories ||
        event.categories.length === 0 ||
        event.categories.some((cat) => selectedCategories.includes(cat));
      return typeMatch && categoryMatch;
    });
  }, [events, selectedTypes, selectedCategories]);

  const displayedEvents = useMemo(() => {
    if (!viewStartDate || !viewEndDate) return [];
    return expandEvents(filteredEvents, viewStartDate, viewEndDate);
  }, [filteredEvents, viewStartDate, viewEndDate]);

  const eventsForSelectedDate = useMemo(() => {
    if (!selectedDate) return [];
    return displayedEvents.filter((event) => {
      if (!event.dtstart) return false;
      const eventDate = event.dtstart;
      return (
        eventDate.getFullYear() === selectedDate.getFullYear() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getDate() === selectedDate.getDate()
      );
    });
  }, [selectedDate, displayedEvents]);

  return (
    <div className="p-4 md:p-8">
      <header className="mb-6 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">
            My Calendar
          </h1>
          <p className="text-gray-500">
            Welcome back, {username}! Here&apos;s a comprehensive view of your
            schedule.
          </p>
        </div>
        <div className="flex items-center flex-wrap justify-end gap-2">
          <FilterDropdown
            title="Event Type"
            options={ALL_EVENT_TYPES}
            selectedOptions={selectedTypes}
            onSelectionChange={setSelectedTypes}
          />
          <FilterDropdown
            title="Category"
            options={allCategories}
            selectedOptions={selectedCategories}
            onSelectionChange={setSelectedCategories}
          />
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 shadow-sm flex items-center space-x-2"
          >
            <SyncIcon />
            <span>Sync</span>
          </button>
          <button
            onClick={() => setIsCreatingEvent(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 shadow-sm flex items-center space-x-2"
          >
            <CreateEventIcon />
            <span>Create Event</span>
          </button>
        </div>
      </header>

      <Calendar
        events={displayedEvents}
        onSelectDate={setSelectedDate}
        currentDate={currentDate}
        calendarGrid={calendarGrid}
        goToNextMonth={goToNextMonth}
        goToPreviousMonth={goToPreviousMonth}
        goToToday={goToToday}
        monthName={monthName}
        year={year}
      />

      {selectedDate && (
        <DayViewModal
          date={selectedDate}
          events={eventsForSelectedDate}
          onClose={() => setSelectedDate(null)}
          onSelectEvent={setSelectedEvent}
        />
      )}

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onEdit={setEditingEvent}
          onDelete={setDeletingEvent}
        />
      )}

      {editingEvent && (
        <EditEventModal
          event={editingEvent}
          onSave={updateEvent}
          onCancel={() => setEditingEvent(null)}
        />
      )}

      {isCreatingEvent && (
        <CreateEventModal
          onSave={createEvent}
          onCancel={() => setIsCreatingEvent(false)}
        />
      )}

      {isSyncModalOpen && (
        <SyncCalendarModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          events={events}
        />
      )}

      {deletingEvent && deletingEvent.isOccurrence ? (
        <RecurringDeleteModal
          isOpen={!!deletingEvent}
          eventName={deletingEvent.summary}
          onCancel={() => setDeletingEvent(null)}
          onDeleteOccurrence={deleteOccurrence}
          onDeleteSeries={deleteSeries}
        />
      ) : (
        <ConfirmationModal
          isOpen={!!deletingEvent}
          title="Confirm Deletion"
          message={`Are you sure you want to delete "${deletingEvent?.summary}"? This action cannot be undone immediately, but you will have a chance to undo.`}
          onConfirm={deleteSeries}
          onCancel={() => setDeletingEvent(null)}
          confirmText="Delete"
        />
      )}

      {undoMessage && lastEventsState && (
        <UndoToast
          message={undoMessage}
          onUndo={handleUndo}
          onDismiss={dismissUndo}
        />
      )}
    </div>
  );
};
