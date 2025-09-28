import { RRule, RRuleSet } from 'rrule';
import { CalendarEvent } from "../validations";

export const expandEvents = (
  events: CalendarEvent[],
  viewStart: Date,
  viewEnd: Date
): CalendarEvent[] => {
  const allOccurrences: CalendarEvent[] = [];

  events.forEach(event => {
    // Ensure dtstart and dtend are Date objects for comparison
    const eventStart = event.dtstart ? new Date(event.dtstart) : null;
    const eventEnd = event.dtend ? new Date(event.dtend) : null;

    if (!event.rrule) {
      // It's a non-recurring event, just check if it's in range
      if (eventStart && eventStart >= viewStart && eventStart <= viewEnd) {
        // Push the original event but ensure its dates are objects
        allOccurrences.push({
          ...event,
          dtstart: eventStart,
          dtend: eventEnd,
        });
      }
    } else {
      // It's a recurring event
      try {
        const ruleOptions = RRule.parseString(event.rrule);
        if (eventStart) {
            ruleOptions.dtstart = eventStart;
        }

        const rule = new RRule(ruleOptions);
        
        const rruleset = new RRuleSet();
        rruleset.rrule(rule);

        if (event.exdate) {
            event.exdate.forEach(exd => {
                // Ensure exdate is also a Date object
                rruleset.exdate(new Date(exd));
            });
        }

        if (event.rdate) {
            event.rdate.forEach(rd => {
                // Ensure rdate is also a Date object
                rruleset.rdate(new Date(rd));
            });
        }
        
        const occurrences = rruleset.between(viewStart, viewEnd);

        occurrences.forEach(occurrenceDate => {
          const duration = eventEnd && eventStart
            ? eventEnd.getTime() - eventStart.getTime()
            : 0;

          const occurrenceStart = occurrenceDate;
          const occurrenceEnd = new Date(occurrenceDate.getTime() + duration);

          allOccurrences.push({
            ...event,
            dtstart: occurrenceStart,
            dtend: occurrenceEnd,
            isOccurrence: true, 
          });
        });
      } catch (e) {
        console.error("Error expanding recurring event:", event.summary, e);
        if (eventStart && eventStart >= viewStart && eventStart <= viewEnd) {
             allOccurrences.push({
               ...event,
               dtstart: eventStart,
               dtend: eventEnd,
             });
        }
      }
    }
  });

  return allOccurrences;
};