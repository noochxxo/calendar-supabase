'use client'

import React, { useState, useEffect } from "react";
import { DateTimeInput } from "./sub-components/DateTimeInput";
// import { RecurrenceEditor } from "./sub-components/RecurrenceEditor";
import { CalendarEvent } from "@/lib/validations";

interface EditEventModalProps {
  event: CalendarEvent;
  onSave: (updatedEvent: CalendarEvent) => void;
  onCancel: () => void;
}

export const EditEventModal = ({
  event,
  onSave,
  onCancel,
}: EditEventModalProps) => {
  const [formData, setFormData] = useState<CalendarEvent>(event);
  const [isRecurring, setIsRecurring] = useState(!!event.rrule);

  useEffect(() => {
    setFormData(event);
    setIsRecurring(!!event.rrule);
  }, [event]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "categories" || name === "resources") {
      setFormData((prev) => ({
        ...prev,
        [name]: value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      }));
    } else if (name === "priority" || name === "percentComplete") {
      const numValue = parseInt(value, 10);
      setFormData((prev) => ({
        ...prev,
        [name]: isNaN(numValue) ? undefined : numValue,
      }));
    }
    //TODO: Handle geo location
    //else if (name === 'geo.lat' || name === 'geo.lon') {
    //     const [key, subkey] = name.split('.');
    //     const numValue = parseFloat(value);
    //     setFormData(prev => ({
    //         ...prev,
    //         geo: { ...prev., [subkey]: isNaN(numValue) ? undefined : numValue }
    //     }));
    // }
    else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleDateTimeChange = (name: string, date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, [name]: date }));
  };

  const handleTimezoneChange = (name: string, timezone: string) => {
    // Single timezone for event for UI simplicity
    setFormData((prev) => ({ ...prev, timezone }));
  };

  const handleRruleChange = (rruleString: string | null) => {
    setFormData((prev) => ({ ...prev, rrule: rruleString }));
  };

  const handleToggleRecurring = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setIsRecurring(checked);
    if (!checked) {
      handleRruleChange(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl m-4 max-h-[90vh] flex flex-col">
        {/* Non-scrolling Header */}
        <div className="p-6 border-b flex-shrink-0">
          <h3 className="text-2xl font-bold text-gray-900">Edit Event</h3>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-grow overflow-hidden"
        >
          {/* Scrollable Content Area */}
          <div className="p-6 overflow-y-auto flex-grow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="md:col-span-2">
                <label
                  htmlFor="summary"
                  className="block text-sm font-medium text-gray-700"
                >
                  Summary
                </label>
                <input
                  type="text"
                  name="summary"
                  id="summary"
                  value={formData.summary || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <DateTimeInput
                  name="dtstart"
                  value={formData.dtstart}
                  timezone={formData.timezone}
                  onChange={handleDateTimeChange}
                  onTimezoneChange={handleTimezoneChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Time
                </label>
                <DateTimeInput
                  name="dtend"
                  value={formData.dtend}
                  timezone={formData.timezone}
                  onChange={handleDateTimeChange}
                  onTimezoneChange={handleTimezoneChange}
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  name="description"
                  id="description"
                  value={formData.description || ""}
                  onChange={handleChange}
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                ></textarea>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center">
                  <input
                    id="is-recurring"
                    name="is-recurring"
                    type="checkbox"
                    checked={isRecurring}
                    onChange={handleToggleRecurring}
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="is-recurring"
                    className="ml-2 block text-sm font-medium text-gray-900"
                  >
                    Repeat
                  </label>
                </div>
              </div>

              {/* {isRecurring && formData.dtstart && (
                <div className="md:col-span-2">
                  <RecurrenceEditor
                    rruleString={formData.rrule}
                    startDate={formData.dtstart}
                    onChange={handleRruleChange}
                  />
                </div>
              )} */}

              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700"
                >
                  Location
                </label>
                <input
                  type="text"
                  name="location"
                  id="location"
                  value={formData.location || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  name="status"
                  id="status"
                  value={formData.status || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                >
                  <option value="">-- Select --</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="TENTATIVE">Tentative</option>
                  <option value="CANCELLED">Cancelled</option>
                  {event.type === "VTODO" && (
                    <>
                      <option value="NEEDS-ACTION">Needs Action</option>
                      <option value="COMPLETED">Completed</option>
                      <option value="IN-PROCESS">In Process</option>
                    </>
                  )}
                </select>
              </div>

              {/* VTODO Specific Fields */}
              {event.type === "VTODO" && (
                <>
                  <div className="md:col-span-2 mt-4 mb-2 border-b">
                    <h4 className="text-lg font-semibold text-gray-800 pb-1">
                      Task Details
                    </h4>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <DateTimeInput
                      name="due"
                      value={formData.due}
                      timezone={formData.timezone}
                      onChange={handleDateTimeChange}
                      onTimezoneChange={handleTimezoneChange}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Completed Date
                    </label>
                    <DateTimeInput
                      name="completed"
                      value={formData.completed}
                      timezone={formData.timezone}
                      onChange={handleDateTimeChange}
                      onTimezoneChange={handleTimezoneChange}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor="percentComplete"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Percent Complete: {formData.percentComplete || 0}%
                    </label>
                    <input
                      type="range"
                      name="percentComplete"
                      id="percentComplete"
                      value={formData.percentComplete || 0}
                      onChange={handleChange}
                      min="0"
                      max="100"
                      className="mt-1 block w-full"
                    />
                  </div>
                </>
              )}

              <div className="md:col-span-2 mt-4 mb-2 border-b">
                <h4 className="text-lg font-semibold text-gray-800 pb-1">
                  Additional Details
                </h4>
              </div>

              <div>
                <label
                  htmlFor="class"
                  className="block text-sm font-medium text-gray-700"
                >
                  Visibility
                </label>
                <select
                  name="class"
                  id="class"
                  value={formData.class || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                >
                  <option value="PUBLIC">Public</option>
                  <option value="PRIVATE">Private</option>
                  <option value="CONFIDENTIAL">Confidential</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="priority"
                  className="block text-sm font-medium text-gray-700"
                >
                  Priority
                </label>
                <input
                  type="number"
                  name="priority"
                  id="priority"
                  value={formData.priority || ""}
                  onChange={handleChange}
                  min="0"
                  max="9"
                  placeholder="0-9"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="transp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Time Blocking
                </label>
                <select
                  name="transp"
                  id="transp"
                  value={formData.transp || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                >
                  <option value="OPAQUE">Busy (Blocks time)</option>
                  <option value="TRANSPARENT">
                    Free (Doesn&apos;t block time)
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="organizer"
                  className="block text-sm font-medium text-gray-700"
                >
                  Organizer
                </label>
                <input
                  type="text"
                  name="organizer"
                  id="organizer"
                  value={formData.organizer || ""}
                  onChange={handleChange}
                  placeholder="organizer@example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="categories"
                  className="block text-sm font-medium text-gray-700"
                >
                  Categories (comma-separated)
                </label>
                <input
                  type="text"
                  name="categories"
                  id="categories"
                  value={formData.categories?.join(", ") || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="resources"
                  className="block text-sm font-medium text-gray-700"
                >
                  Resources (comma-separated)
                </label>
                <input
                  type="text"
                  name="resources"
                  id="resources"
                  value={formData.resources?.join(", ") || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="url"
                  className="block text-sm font-medium text-gray-700"
                >
                  URL
                </label>
                <input
                  type="url"
                  name="url"
                  id="url"
                  value={formData.url || ""}
                  onChange={handleChange}
                  placeholder="https://example.com"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="contact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Contact
                </label>
                <input
                  type="text"
                  name="contact"
                  id="contact"
                  value={formData.contact || ""}
                  onChange={handleChange}
                  placeholder="Contact info or email"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="geo.lat"
                  className="block text-sm font-medium text-gray-700"
                >
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="geo.lat"
                  id="geo.lat"
                  value={formData.geoLat || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="geo.lon"
                  className="block text-sm font-medium text-gray-700"
                >
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  name="geo.lon"
                  id="geo.lon"
                  value={formData.geoLon || ""}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-white"
                />
              </div>
            </div>
          </div>
          {/* Non-scrolling Footer */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3 rounded-b-lg border-t flex-shrink-0">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
