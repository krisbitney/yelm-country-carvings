import {atcb_action, ATCBActionEventConfig} from 'add-to-calendar-button';
import {MarketEvent} from "../../types.ts";

// Add event to calendar function using add-to-calendar-button library
export const addToCalendar = async (event: MarketEvent, e: React.MouseEvent) => {
  e.stopPropagation(); // Prevent toggling the event details

  if (!event.startDate || !event.endDate) {
    console.error('Event dates could not be parsed correctly');
    return;
  }

  // Configure the calendar event options
  const calendarEvent: ATCBActionEventConfig = {
    name: event.title,
    description: "Hello from Yelm Country Carvings! " + event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location,
    options: [
      'Apple',
      'Google',
      'iCal',
      'Microsoft365',
      'Outlook.com',
      'Yahoo',
    ],
    timeZone: 'America/Los_Angeles',
    iCalFileName: event.title.replace(/\s+/g, '_').toLowerCase(),
  };

  // Trigger the add-to-calendar action
  await atcb_action(calendarEvent);
};