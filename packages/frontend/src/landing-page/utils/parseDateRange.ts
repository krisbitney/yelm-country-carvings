import {format, parse} from "date-fns";

// Helper function to parse date ranges and calculate start/end dates
export const parseDateRange = (dateString: string): { startDate: string, endDate: string } => {
  // Handle different date formats: "Month Day-Day, Year" or "Month Day, Year"
  const dateRegex = /([A-Za-z]+)\s+(\d+)(?:-(\d+))?,\s+(\d{4})/;
  const match = dateString.match(dateRegex);

  if (match) {
    const [, month, startDay, endDay, year] = match;

    // Parse the start date
    const startDateObj = parse(`${month} ${startDay} ${year}`, 'MMMM d yyyy', new Date());
    const formattedStartDate = format(startDateObj, 'yyyy-MM-dd');

    // If there's an end day, parse it, otherwise use the start date
    let formattedEndDate;
    if (endDay) {
      // For multi-day events, end date has same month and year as start date
      const endDateObj = parse(`${month} ${endDay} ${year}`, 'MMMM d yyyy', new Date());
      formattedEndDate = format(endDateObj, 'yyyy-MM-dd');
    } else {
      // For single-day events, end date is the same as start date
      formattedEndDate = formattedStartDate;
    }

    return { startDate: formattedStartDate, endDate: formattedEndDate };
  }

  // Fallback to today's date if parsing fails
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');
  return { startDate: formattedToday, endDate: formattedToday };
};