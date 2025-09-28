import { CalendarEvent } from "@/lib/validations";
import { CalendarHeader } from "./sub-components/CalendarHeader";
import { DayCell } from "./sub-components/DayCell";

interface CalendarProps {
  events: CalendarEvent[];
  onSelectDate: (date: Date) => void;
  currentDate: Date;
  goToNextMonth: () => void;
  goToPreviousMonth: () => void;
  goToToday: () => void;
  monthName: string;
  year: number;
  calendarGrid: { date: Date; isCurrentMonth: boolean }[];
}

const isSameDay = (d1: Date, d2: Date) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

export const Calendar = ({
  events,
  onSelectDate,
  goToNextMonth,
  goToPreviousMonth,
  goToToday,
  monthName,
  year,
  calendarGrid,
}: CalendarProps) => {
  const weekdays = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const today = new Date();
  // console.log('Calendar:', events)
  return (
    <div className="bg-white rounded-lg shadow-lg">
      <CalendarHeader
        monthName={monthName}
        year={year}
        onNext={goToNextMonth}
        onPrev={goToPreviousMonth}
        onToday={goToToday}
      />
      <div className="grid grid-cols-7 border-l border-b border-gray-200">
        {weekdays.map((day) => (
          <div
            key={day}
            className="py-2 px-1 text-center text-xs sm:text-sm font-semibold text-gray-500 border-t border-r border-gray-200 bg-gray-50"
          >
            {day}
          </div>
        ))}
        {calendarGrid.map((day, index) => {
          const dayEvents = events.filter(
            (event) => event.dtstart && isSameDay(event.dtstart, day.date)
          );
          return (
            <DayCell
              key={index}
              day={day}
              events={dayEvents}
              onSelectDate={onSelectDate}
              isToday={isSameDay(day.date, today)}
            />
          );
        })}
      </div>
    </div>
  );
};
