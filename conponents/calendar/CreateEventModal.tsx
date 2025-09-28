import { CalendarEvent } from "@/lib/validations";
import { CreateCalendarEventsForm } from "./sub-components/calendar-events-form";

interface CreateEventModalProps {
  onSave: (newEvent: Omit<CalendarEvent, "uid">) => void;
  onCancel: () => void;
}

export const CreateEventModal = ({
  onSave,
  onCancel,
}: CreateEventModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl m-4 max-h-[90vh] flex flex-col">
        <div className="p-6 border-b flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-900">Create New Event</h3>
        </div>

        <CreateCalendarEventsForm />
      </div>
    </div>
  );
};
