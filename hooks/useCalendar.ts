
// import { useState, useMemo } from 'react';

// const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

// export const useCalendar = (initialDate: Date = new Date()) => {
//   const [currentDate, setCurrentDate] = useState(initialDate);

//   const year = currentDate.getFullYear();
//   const month = currentDate.getMonth();

//   const { grid: calendarGrid, viewStartDate, viewEndDate } = useMemo(() => {
//     const firstDayOfMonth = new Date(year, month, 1).getDay();
//     const daysInMonth = getDaysInMonth(year, month);
    
//     const prevMonth = month === 0 ? 11 : month - 1;
//     const prevYear = month === 0 ? year - 1 : year;
//     const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

//     const grid: { date: Date; isCurrentMonth: boolean }[] = [];
    
//     // Previous month's padding days
//     for (let i = firstDayOfMonth - 1; i >= 0; i--) {
//       grid.push({
//         date: new Date(prevYear, prevMonth, daysInPrevMonth - i),
//         isCurrentMonth: false,
//       });
//     }

//     // Current month's days
//     for (let i = 1; i <= daysInMonth; i++) {
//       grid.push({
//         date: new Date(year, month, i),
//         isCurrentMonth: true,
//       });
//     }

//     // Next month's padding days
//     const nextMonth = month === 11 ? 0 : month + 1;
//     const nextYear = month === 11 ? year + 1 : year;
//     let day = 1;
//     while (grid.length % 7 !== 0) {
//       grid.push({
//         date: new Date(nextYear, nextMonth, day++),
//         isCurrentMonth: false,
//       });
//     }
    
//     const viewStartDate = grid[0].date;
//     const viewEndDate = new Date(grid[grid.length-1].date);
//     viewEndDate.setHours(23, 59, 59, 999); // End of the last day

//     return { grid, viewStartDate, viewEndDate };

//   }, [year, month]);

//   const goToNextMonth = () => {
//     setCurrentDate(new Date(year, month + 1, 1));
//   };

//   const goToPreviousMonth = () => {
//     setCurrentDate(new Date(year, month - 1, 1));
//   };

//   const goToToday = () => {
//     setCurrentDate(new Date());
//   };
  
//   const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
//   return { currentDate, calendarGrid, goToNextMonth, goToPreviousMonth, goToToday, monthName, year, viewStartDate, viewEndDate };
// };

import { useState, useMemo } from 'react';

// Helper function to get the number of days in a given month and year
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export const useCalendar = (initialDate: Date = new Date()) => {
  const [currentDate, setCurrentDate] = useState(initialDate);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { grid: calendarGrid, viewStartDate, viewEndDate } = useMemo(() => {
    // 🗓️ FIX: Adjust day index for a Monday-first week.
    // Sunday (0) becomes 6, Monday (1) becomes 0, etc.
    const firstDayOfMonth = (new Date(year, month, 1).getDay() + 6) % 7;
    
    const daysInMonth = getDaysInMonth(year, month);
    
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    const grid: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Add padding days from the previous month
    for (let i = firstDayOfMonth; i > 0; i--) {
      grid.push({
        date: new Date(prevYear, prevMonth, daysInPrevMonth - i + 1),
        isCurrentMonth: false,
      });
    }

    // Add days for the current month
    for (let i = 1; i <= daysInMonth; i++) {
      grid.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Add padding days for the next month
    const nextMonth = month === 11 ? 0 : month + 1;
    const nextYear = month === 11 ? year + 1 : year;
    let day = 1;
    while (grid.length % 7 !== 0) {
      grid.push({
        date: new Date(nextYear, nextMonth, day++),
        isCurrentMonth: false,
      });
    }
    
    const viewStartDate = grid[0].date;
    const viewEndDate = new Date(grid[grid.length-1].date);
    viewEndDate.setHours(23, 59, 59, 999); // Set to the end of the last day

    return { grid, viewStartDate, viewEndDate };

  }, [year, month]);

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };
  
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  
  return { 
    currentDate, 
    calendarGrid, 
    goToNextMonth, 
    goToPreviousMonth, 
    goToToday, 
    monthName, 
    year, 
    viewStartDate, 
    viewEndDate 
  };
};