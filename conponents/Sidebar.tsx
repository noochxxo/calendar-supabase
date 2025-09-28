'use client'

import { useIsSidebarOpen } from "@/stores/useSidebarStore";
import { useEffect } from "react";
import { useSidebarActions } from "@/stores/useSidebarStore";

// const defaultCalendars: AppCalendar[] = [
//     { id: 'personal', name: 'Personal', color: 'blue' },
//     { id: 'work', name: 'Work', color: 'green' },
//     { id: 'family', name: 'Family', color: 'purple' },
// ];

const colorMap: { [key: string]: string } = {
  blue: "bg-blue-500",
  green: "bg-green-500",
  purple: "bg-purple-500",
  red: "bg-red-500",
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  teal: "bg-teal-500",
  indigo: "bg-indigo-500",
  pink: "bg-pink-500",
};

const Sidebar = () => {
  const isOpen = useIsSidebarOpen();
  // const {onClose} = useSidebarActions();
  const {openSidebar} = useSidebarActions();
  const {closeSidebar} =useSidebarActions();
    

  useEffect(() => {
    closeSidebar()

    if (window.innerWidth >= 768) {
      openSidebar();
    }
  }, [openSidebar, closeSidebar]);

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
        ></div>
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-800 text-white transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-700 flex justify-between items-center">
            <h2 className="text-xl font-bold">My Calendars</h2>
            <button
              onClick={closeSidebar}
              className="p-1 text-gray-400 rounded-md hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close sidebar"
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

          <nav className="flex-grow p-2 space-y-1">
            <ul>
              {/* {calendars.map((cal) => {
                const colorClass = cal.color
                  ? colorMap[cal.color] || "bg-gray-500"
                  : "bg-gray-500";
                return (
                  <li key={cal.id}>
                    <a
                      href="#"
                      className="flex items-center px-3 py-2 text-gray-300 hover:bg-gray-700 hover:text-white rounded-md transition-colors"
                    >
                      <span
                        className={`w-3 h-3 rounded-full mr-3 ${colorClass}`}
                      ></span>
                      <span className="flex-1">{cal.name}</span>
                    </a>
                  </li>
                );
              })} */}
            </ul>
          </nav>

          <div className="p-4 border-t border-gray-700">
            {/* <button
              onClick={openCreateModal}
              className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              New Calendar
            </button> */}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
