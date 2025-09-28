// 'use client'

// import { RRule } from 'rrule';
// import { useState, useEffect } from "react";

// interface RecurrenceEditorProps {
//   rruleString: string | null;
//   startDate: Date;
//   onChange: (rruleString: string) => void;
// }

// type Freq = "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
// type EndType = "never" | "until" | "count";

// const WEEKDAYS = [
//   { value: RRule.SU, label: "S" },
//   { value: RRule.MO, label: "M" },
//   { value: RRule.TU, label: "T" },
//   { value: RRule.WE, label: "W" },
//   { value: RRule.TH, label: "T" },
//   { value: RRule.FR, label: "F" },
//   { value: RRule.SA, label: "S" },
// ];

// export const RecurrenceEditor = ({
//   rruleString,
//   startDate,
//   onChange,
// }: RecurrenceEditorProps) => {
//   const [freq, setFreq] = useState<Freq>("WEEKLY");
//   const [interval, setInterval] = useState(1);
//   const [endType, setEndType] = useState<EndType>("never");
//   const [untilDate, setUntilDate] = useState("");
//   const [count, setCount] = useState(10);
//   const [weeklyByDay, setWeeklyByDay] = useState<any[]>([]);

//   useEffect(() => {
//     if (rruleString) {
//       try {
//         const rule = RRule.fromString(rruleString);
//         const options = rule.options;
//         setFreq(RRule.FREQUENCIES[options.freq] as Freq);
//         setInterval(options.interval);
//         setWeeklyByDay(options.byweekday || []);
//         if (options.until) {
//           setEndType("until");
//           setUntilDate(options.until.toISOString().split("T")[0]);
//         } else if (options.count) {
//           setEndType("count");
//           setCount(options.count);
//         } else {
//           setEndType("never");
//         }
//       } catch (e) {
//         console.error("Error parsing RRULE string:", e);
//       }
//     } else {
//       // Default to weekly on the current day when enabling
//       const startDay = startDate.getDay(); // Sunday is 0
//       setWeeklyByDay([startDay]);
//     }
//   }, [rruleString, startDate]);

//   useEffect(() => {
//     const buildRruleString = () => {
//       if (!freq) return;

//       const options: any = {
//         freq: RRule[freq],
//         interval: interval || 1,
//         dtstart: startDate,
//       };

//       if (freq === "WEEKLY" && weeklyByDay.length > 0) {
//         options.byweekday = weeklyByDay;
//       }

//       if (endType === "until" && untilDate) {
//         options.until = new Date(untilDate + "T23:59:59Z");
//       } else if (endType === "count" && count) {
//         options.count = count;
//       }

//       onChange(new RRule(options).toString());
//     };
//     buildRruleString();
//   }, [
//     freq,
//     interval,
//     endType,
//     untilDate,
//     count,
//     weeklyByDay,
//     startDate,
//     onChange,
//   ]);

//   const handleByDayToggle = (day: any) => {
//     setWeeklyByDay((prev) =>
//       prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
//     );
//   };

//   return (
//     <div className="space-y-4 p-4 border border-gray-200 rounded-md bg-gray-50">
//       <div className="flex items-center space-x-2">
//         <span>Repeat every</span>
//         <input
//           type="number"
//           value={interval}
//           onChange={(e) => setInterval(parseInt(e.target.value, 10) || 1)}
//           className="w-16 border-gray-300 rounded-md shadow-sm text-sm p-2 bg-white"
//           min="1"
//         />
//         <select
//           value={freq}
//           onChange={(e) => setFreq(e.target.value as Freq)}
//           className="border-gray-300 rounded-md shadow-sm text-sm p-2 bg-white"
//         >
//           <option value="DAILY">Day(s)</option>
//           <option value="WEEKLY">Week(s)</option>
//           <option value="MONTHLY">Month(s)</option>
//           <option value="YEARLY">Year(s)</option>
//         </select>
//       </div>

//       {freq === "WEEKLY" && (
//         <div>
//           <span className="block text-sm font-medium text-gray-700 mb-2">
//             On days
//           </span>
//           <div className="flex space-x-1">
//             {WEEKDAYS.map(({ value, label }, index) => (
//               <button
//                 key={index}
//                 type="button"
//                 onClick={() => handleByDayToggle(value.weekday)}
//                 className={`h-8 w-8 rounded-full text-sm font-semibold transition-colors ${
//                   weeklyByDay.includes(value.weekday)
//                     ? "bg-indigo-600 text-white"
//                     : "bg-white hover:bg-gray-200"
//                 }`}
//               >
//                 {label}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       <div>
//         <span className="block text-sm font-medium text-gray-700 mb-2">
//           Ends
//         </span>
//         <div className="space-y-2">
//           <div className="flex items-center">
//             <input
//               id="end-never"
//               type="radio"
//               value="never"
//               name="endType"
//               checked={endType === "never"}
//               onChange={() => setEndType("never")}
//               className="h-4 w-4 text-indigo-600 border-gray-300"
//             />
//             <label
//               htmlFor="end-never"
//               className="ml-3 block text-sm text-gray-900"
//             >
//               Never
//             </label>
//           </div>
//           <div className="flex items-center">
//             <input
//               id="end-until"
//               type="radio"
//               value="until"
//               name="endType"
//               checked={endType === "until"}
//               onChange={() => setEndType("until")}
//               className="h-4 w-4 text-indigo-600 border-gray-300"
//             />
//             <label
//               htmlFor="end-until"
//               className="ml-3 flex items-center text-sm text-gray-900"
//             >
//               On
//             </label>
//             <input
//               type="date"
//               value={untilDate}
//               onChange={(e) => {
//                 setEndType("until");
//                 setUntilDate(e.target.value);
//               }}
//               className="ml-2 border-gray-300 rounded-md shadow-sm text-sm p-2 bg-white"
//               disabled={endType !== "until"}
//             />
//           </div>
//           <div className="flex items-center">
//             <input
//               id="end-count"
//               type="radio"
//               value="count"
//               name="endType"
//               checked={endType === "count"}
//               onChange={() => setEndType("count")}
//               className="h-4 w-4 text-indigo-600 border-gray-300"
//             />
//             <label
//               htmlFor="end-count"
//               className="ml-3 flex items-center text-sm text-gray-900"
//             >
//               After
//             </label>
//             <input
//               type="number"
//               value={count}
//               onChange={(e) => {
//                 setEndType("count");
//                 setCount(parseInt(e.target.value, 10));
//               }}
//               className="ml-2 w-20 border-gray-300 rounded-md shadow-sm text-sm p-2 bg-white"
//               disabled={endType !== "count"}
//               min="1"
//             />
//             <span className="ml-2 text-sm text-gray-900">occurrences</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
