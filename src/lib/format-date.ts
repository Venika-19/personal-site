import { format } from "date-fns";

export function formatDate(date?: string, pattern = "MMM d, yyyy") {
  if (!date) return "";
  try {
    return format(new Date(date), pattern);
  } catch {
    return date;
  }
}
