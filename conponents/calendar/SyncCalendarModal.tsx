'use client'

import { CalendarEvent } from "@/lib/validations";
import { useState } from "react";
import { AppleIcon, ExportIcon, GoogleIcon, OutlookIcon } from "../icons";

interface SyncCalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  events: CalendarEvent[];
}

type SyncService = "google" | "outlook" | "apple";
type SyncStatus = {
  service: SyncService;
  status: "loading" | "success" | "idle";
};

export const SyncCalendarModal = ({
  isOpen,
  onClose,
  events,
}: SyncCalendarModalProps) => {
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    service: "google",
    status: "idle",
  });

  if (!isOpen) return null;

  const handleSync = (service: SyncService) => {
    setSyncStatus({ service, status: "loading" });
    setTimeout(() => {
      setSyncStatus({ service, status: "success" });
      setTimeout(() => {
        setSyncStatus({ service, status: "idle" });
        onClose();
      }, 1500);
    }, 1000);
  };

  const handleExport = () => {
    try {
      console.log('handle export')
      onClose();
    } catch (error) {
      console.error("Failed to generate or download ICS file:", error);
      alert("An error occurred while exporting the calendar.");
    }
  };

  const services: {
    id: SyncService;
    name: string;
    icon: React.ReactNode;
    action: () => void;
  }[] = [
    {
      id: "google",
      name: "Google Calendar",
      icon: <GoogleIcon />,
      action: () => handleSync("google"),
    },
    {
      id: "outlook",
      name: "Microsoft Outlook",
      icon: <OutlookIcon />,
      action: () => handleSync("outlook"),
    },
    {
      id: "apple",
      name: "Apple Calendar",
      icon: <AppleIcon />,
      action: () => handleSync("apple"),
    },
  ];

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900">Sync Calendar</h3>
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
        <p className="text-gray-600 mb-6">
          Choose a service to sync your calendar with, or export the data to a
          file.
        </p>

        <div className="space-y-3">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={service.action}
              disabled={syncStatus.status !== "idle"}
              className="w-full flex items-center text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <span className="mr-3">{service.icon}</span>
              <span className="flex-grow font-semibold text-gray-700">
                {service.name}
              </span>
              {syncStatus.service === service.id &&
                syncStatus.status === "loading" && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
                )}
              {syncStatus.service === service.id &&
                syncStatus.status === "success" && (
                  <svg
                    className="h-6 w-6 text-green-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
            </button>
          ))}

          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <button
            onClick={handleExport}
            className="w-full flex items-center text-left px-4 py-3 bg-gray-100 border border-transparent rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400 transition-colors duration-200"
          >
            <span className="mr-3 text-gray-600">
              <ExportIcon />
            </span>
            <span className="flex-grow font-semibold text-gray-800">
              Export .ics File
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
