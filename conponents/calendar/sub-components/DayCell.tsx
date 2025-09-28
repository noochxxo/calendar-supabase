import { EVENT_TYPE_COLORS } from "@/lib/constants";
import { CalendarEvent } from "@/lib/validations";

export const DayCell = ({
  day,
  events,
  onSelectDate,
  isToday,
}: {
  day: { date: Date; isCurrentMonth: boolean };
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  isToday: boolean;
}) => {
  const cellClasses = `relative flex flex-col h-24 sm:h-28 md:h-36 p-1 sm:p-2 border-t border-r border-gray-200 transition-colors duration-200 ${
    day.isCurrentMonth ? "bg-white" : "bg-gray-50 text-gray-400"
  } hover:bg-gray-100`;
  const dayNumberClasses = `text-sm font-semibold ${
    isToday
      ? "bg-indigo-600 text-white rounded-full h-6 w-6 sm:h-7 sm:w-7 flex items-center justify-center"
      : "text-gray-700"
  }`;
  // console.log('DAY CELL:', events)
  return (
    <div className={cellClasses} onClick={() => onSelectDate(day.date)}>
      <div className="flex justify-end">
        <span
          className={`${dayNumberClasses} ${
            !day.isCurrentMonth && "text-gray-400"
          }`}
        >
          {day.date.getDate()}
        </span>
      </div>
      <div className="flex-grow overflow-y-auto mt-1 space-y-1">
        {events.map((event) => {
          const color =
            EVENT_TYPE_COLORS[
              event.status === "CANCELLED" ? "CANCELLED" : event.type
            ] || EVENT_TYPE_COLORS.UNKNOWN;
          return (
            <div
              key={`${event.uid}-${event.dtstart?.getTime()}`}
              className={`px-1 sm:px-2 py-0.5 text-[10px] sm:text-xs font-medium rounded ${color.bg} ${color.text} truncate`}
            >
              {event.summary || "Event"}
            </div>
          );
        })}
      </div>
    </div>
  );
};