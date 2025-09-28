import { EVENT_TYPE_COLORS, PRIORITY_COLORS } from "@/lib/constants";
import { CalendarEvent } from "@/lib/validations";

interface DayViewModalProps {
  date: Date;
  events: CalendarEvent[];
  onClose: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

const EventItem = ({
  event,
  onSelectEvent,
}: {
  event: CalendarEvent;
  onSelectEvent: (event: CalendarEvent) => void;
}) => {
  const color =
    EVENT_TYPE_COLORS[
      event.status === "CANCELLED" ? "CANCELLED" : event.type
    ] || EVENT_TYPE_COLORS.UNKNOWN;
  const priorityClass = event.priority
    ? PRIORITY_COLORS[event.priority] || ""
    : "";

  const formatTime = (date: Date) => {
    if (!date) return "All day";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <li
      onClick={() => onSelectEvent(event)}
      className={`flex items-start space-x-4 p-3 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${priorityClass}`}
    >
      <div
        className={`w-2 h-16 rounded-full ${color.bg} border ${color.border}`}
      ></div>
      <div className="flex-1">
        <p className="font-semibold text-gray-800">
          {event.summary || "No Title"}
        </p>
        <p className="text-sm text-gray-500">
          {event.dtstart && formatTime(event.dtstart)} - {event.dtend && formatTime(event.dtend)}
        </p>
        {event.location && (
          <p className="text-sm text-gray-500 mt-1">{event.location}</p>
        )}
      </div>
    </li>
  );
};

export const DayViewModal = ({
  date,
  events,
  onClose,
  onSelectEvent,
}: DayViewModalProps) => {
  const sortedEvents = [...events].sort(
    (a, b) => (a.dtstart?.getTime() || 0) - (b.dtstart?.getTime() || 0)
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-30 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md m-4 max-h-[80vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">
            {date.toLocaleDateString("default", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto">
          {sortedEvents.length > 0 ? (
            <ul className="space-y-2">
              {sortedEvents.map((event) => (
                <EventItem
                  key={event.uid}
                  event={event}
                  onSelectEvent={onSelectEvent}
                />
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">
              No events scheduled for this day.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
