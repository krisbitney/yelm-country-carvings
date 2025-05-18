// Generate date string from start and end dates
export const generateDateString = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  // Format the dates
  const startMonth = start.toLocaleString('default', { month: 'long' });
  const endMonth = end.toLocaleString('default', { month: 'long' });

  const startDay = start.getDate();
  const endDay = end.getDate();

  const startYear = start.getFullYear();
  const endYear = end.getFullYear();

  // If same year and month
  if (startYear === endYear && startMonth === endMonth) {
    return `${startMonth} ${startDay}-${endDay}, ${startYear}`;
  }

  // If same year but different month
  if (startYear === endYear) {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
  }

  // Different years
  return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
};