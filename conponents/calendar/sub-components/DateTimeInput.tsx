'use client'

import { COMMON_TIMEZONES } from "@/lib/constants";
import { formatInTimezone } from "@/lib/utils";
import React, { useState, useEffect } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const ICAL: any;

interface DateTimeInputProps {
  name: string;
  value: Date | null;
  timezone: string | null;
  onChange: (name: string, value: Date | undefined) => void;
  onTimezoneChange: (name: string, timezone: string) => void;
  className?: string;
}

export const DateTimeInput = ({
  name,
  value,
  timezone,
  onChange,
  onTimezoneChange,
  className,
}: DateTimeInputProps) => {
  const resolvedTimezone =
    timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;
  const initialParts = value
    ? formatInTimezone(value, resolvedTimezone)
    : { datePart: "", timePart: "" };

  const [datePart, setDatePart] = useState(initialParts.datePart);
  const [timePart, setTimePart] = useState(initialParts.timePart);

  useEffect(() => {
    if (value) {
      const { datePart: newDatePart, timePart: newTimePart } = formatInTimezone(
        value,
        resolvedTimezone
      );
      setDatePart(newDatePart);
      setTimePart(newTimePart);
    } else {
      setDatePart("");
      setTimePart("");
    }
  }, [value, resolvedTimezone]);

  const triggerChange = (
    newDatePart: string,
    newTimePart: string,
    newTimezone: string
  ) => {
    if (newDatePart && newTimePart) {
      try {
        // Format for ICAL.Time.fromString: YYYYMMDDTHHmmSS
        const icalDateTimeString = `${newDatePart.replace(
          /-/g,
          ""
        )}T${newTimePart.replace(/:/g, "")}00`;

        const icalTimezone = new ICAL.Timezone({ tzid: newTimezone });
        const icalTime = ICAL.Time.fromString(icalDateTimeString, icalTimezone);

        const newDate = icalTime.toJSDate();
        onChange(name, newDate);
      } catch (e) {
        console.error(
          "Error creating date from parts:",
          { newDatePart, newTimePart, newTimezone },
          e
        );
      }
    } else {
      onChange(name, undefined);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDatePart = e.target.value;
    setDatePart(newDatePart);
    triggerChange(newDatePart, timePart, resolvedTimezone);
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTimePart = e.target.value;
    setTimePart(newTimePart);
    triggerChange(datePart, newTimePart, resolvedTimezone);
  };

  const handleTimezoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimezone = e.target.value;
    onTimezoneChange(name, newTimezone);
    triggerChange(datePart, timePart, newTimezone);
  };

  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex space-x-2">
        <input
          type="date"
          value={datePart}
          onChange={handleDateChange}
          className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
        />
        <input
          type="time"
          value={timePart}
          onChange={handleTimeChange}
          className="mt-1 block w-1/2 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
        />
      </div>
      <select
        value={resolvedTimezone}
        onChange={handleTimezoneChange}
        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
      >
        {COMMON_TIMEZONES.map((tz) => (
          <option key={tz} value={tz}>
            {tz}
          </option>
        ))}
      </select>
    </div>
  );
};
