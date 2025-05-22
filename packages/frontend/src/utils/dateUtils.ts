/**
 * Format a date range from timestamps into a human-readable string
 * Example: "June 13-15, 2025"
 *
 * @param _startDate - Start date
 * @param _endDate - End date
 * @returns Formatted date string
 */
export const formatDateRange = (
  _startDate: string | number | Date,
  _endDate: string | number | Date
): string => {
  const startDate = new Date(_startDate);
  const endDate = new Date(_endDate);

  // Format month
  const month = startDate.toLocaleString('en-US', { month: 'long' });

  // Get start and end days
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  // Get year (use end date's year in case the range spans multiple years)
  const year = endDate.getFullYear();

  // Check if start and end dates are in the same month and year
  const sameMonth = startDate.getMonth() === endDate.getMonth();
  const sameYear = startDate.getFullYear() === endDate.getFullYear();

  if (sameMonth && sameYear) {
    // Same month and year (e.g., "June 13-15, 2025")
    if (startDay === endDay) {
      // Single day event
      return `${month} ${startDay}, ${year}`;
    } else {
      // Multi-day event in same month
      return `${month} ${startDay}-${endDay}, ${year}`;
    }
  } else if (sameYear) {
    // Different months, same year (e.g., "June 30-July 2, 2025")
    const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
    return `${month} ${startDay}-${endMonth} ${endDay}, ${year}`;
  } else {
    // Different years (e.g., "December 30, 2024-January 2, 2025")
    const endMonth = endDate.toLocaleString('en-US', { month: 'long' });
    const startYear = startDate.getFullYear();
    return `${month} ${startDay}, ${startYear}-${endMonth} ${endDay}, ${year}`;
  }
};

export const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};
