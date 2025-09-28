
interface RecurringDeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDeleteOccurrence: () => void;
  onDeleteSeries: () => void;
  eventName: string | null;
}

export const RecurringDeleteModal = ({
  isOpen,
  onCancel,
  onDeleteOccurrence,
  onDeleteSeries,
  eventName,
}: RecurringDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg m-4">
        <h3 className="text-xl font-bold text-gray-900">
          Delete recurring event
        </h3>
        <p className="mt-2 text-gray-600">
          Would you like to delete only this event, or all events in the series
          for &quot;{eventName}&quot;?
        </p>
        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={onDeleteSeries}
            className="w-full sm:w-auto px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            All events in the series
          </button>
          <button
            onClick={onDeleteOccurrence}
            className="w-full sm:w-auto px-4 py-2 bg-white text-gray-800 rounded-md border border-gray-300 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            This event only
          </button>
          <button
            onClick={onCancel}
            className="w-full sm:w-auto mt-2 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
