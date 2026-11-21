const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Reads "MM/YYYY" (also accepts "M/YYYY" or "MM-YYYY"). Returns null when invalid.
export function parseMonthYear(text) {
  const match = /^\s*(\d{1,2})\s*[/-]\s*(\d{4})\s*$/.exec(text ?? "");
  if (!match) return null;

  const month = Number(match[1]);
  const year = Number(match[2]);
  if (month < 1 || month > 12 || year < 1950 || year > new Date().getFullYear() + 1) {
    return null;
  }

  return { month, year };
}

export const monthYearValue = ({ month, year }) => year * 12 + month;
export const formatMonthYear = ({ month, year }) => `${MONTHS[month - 1]} ${year}`;

// "Jun 2021 – Aug 2023" or "Jun 2021 – Present", shown on the profile card.
export function formatDateRange(start, end, isCurrent) {
  return `${formatMonthYear(start)} – ${isCurrent ? "Present" : formatMonthYear(end)}`;
}