import { EVENT_TYPE_COLORS, PRIORITY_COLORS } from "@/lib/constants";
import { CalendarEvent } from "@/lib/validations";

interface EventDetailModalProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
  onDelete: (event: CalendarEvent) => void;
}

const DetailItem = ({
  label,
  value,
  className,
}: {
  label: string;
  value?: string | number | React.ReactNode;
  className?: string;
}) => {
  if (!value) return null;
  return (
    <div className={`mb-3 ${className}`}>
      <p className="text-sm font-semibold text-gray-500">{label}</p>
      <div className="text-gray-800">{value}</div>
    </div>
  );
};

export const EventDetailModal = ({
  event,
  onClose,
  onEdit,
  onDelete,
}: EventDetailModalProps) => {
  const color =
    EVENT_TYPE_COLORS[
      event.status === "CANCELLED" ? "CANCELLED" : event.type
    ] || EVENT_TYPE_COLORS.UNKNOWN;
  const priorityClass = event.priority
    ? PRIORITY_COLORS[event.priority] || ""
    : "";

  const formatDateTime = (date?: Date) => date?.toLocaleString() || "N/A";

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 z-40 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-5 rounded-t-xl ${color.bg} ${priorityClass}`}>
          <div className="flex justify-between items-start">
            <div>
              <span
                className={`px-2 py-1 text-xs font-bold rounded-full ${color.bg} ${color.text}`}
              >
                {event.type}
              </span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">
                {event.summary || "No Title"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800"
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
        </div>

        <div className="p-6 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <DetailItem label="Status" value={event.status} />
              <DetailItem
                label="Start Time"
                value={event.dtstart && formatDateTime(event.dtstart)}
              />
              <DetailItem
                label="End Time"
                value={event.dtend && formatDateTime(event.dtend)}
              />
              <DetailItem label="Location" value={event.location} />
              <DetailItem
                label="Description"
                value={
                  <p className="whitespace-pre-wrap">{event.description}</p>
                }
              />
            </div>
            <div>
              <DetailItem label="Priority" value={event.priority} />
              <DetailItem
                label="Categories"
                value={event.categories?.join(", ")}
              />
              <DetailItem label="Organizer" value={event.organizer} />
              {/* TODO: Get attendees */}
              {/* {event. && (
                         <div>
                            <p className="text-sm font-semibold text-gray-500 mb-1">Attendees</p>
                            <ul className="list-disc pl-5 text-gray-800 space-y-1">
                                {event.attendees.map((att, i) => <li key={i}>{att.cn || att.email} ({att.partstat})</li>)}
                            </ul>
                        </div>
                    )} */}
            </div>
          </div>
          {/* TODO: Get the alarms */}
          {/* {event.alarms && (
                <div className="mt-6">
                    <p className="text-sm font-semibold text-gray-500 mb-1">Alarms</p>
                    <ul className="list-disc pl-5 text-gray-800 space-y-1">
                        {event.alarms.map((alarm, i) => <li key={i}>{alarm.action}: {alarm.description} (Trigger: {alarm.trigger})</li>)}
                    </ul>
                </div>
            )} */}
        </div>

        <div className="p-4 bg-gray-50 border-t rounded-b-xl flex justify-end space-x-3">
          <button
            onClick={() => onEdit(event)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(event)}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
