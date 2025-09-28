export const CalendarHeader = ({
  monthName,
  year,
  onNext,
  onPrev,
  onToday,
}: {
  monthName: string;
  year: number;
  onNext: () => void;
  onPrev: () => void;
  onToday: () => void;
}) => (
  <div className="flex items-center justify-between px-6 py-4">
    <div className="flex items-center space-x-4">
      <h1 className="text-2xl font-bold text-gray-800">
        {monthName} {year}
      </h1>
      <button
        onClick={onToday}
        className="px-4 py-2 text-sm font-semibold text-gray-600 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
      >
        Today
      </button>
    </div>
    <div className="flex items-center space-x-2">
      <button
        onClick={onPrev}
        className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>
      <button
        onClick={onNext}
        className="p-2 text-gray-500 rounded-full hover:bg-gray-100"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  </div>
);
