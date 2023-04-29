const MILLISECONDS_PER_MINUTE = 60 * 1000;
const MILLISECONDS_PER_HOUR = 60 * MILLISECONDS_PER_MINUTE;
const MILLISECONDS_PER_DAY = 24 * MILLISECONDS_PER_HOUR;
const MILLISECONDS_PER_MONTH = 30 * MILLISECONDS_PER_DAY;
const MILLISECONDS_PER_YEAR = 365 * MILLISECONDS_PER_DAY;

export function formatTime(timestamp) {
  const time = Date.parse(timestamp);
  const now = Date.now();
  const diff = now - time;

  if (isNaN(diff)) {
    return "";
  } else if (diff < MILLISECONDS_PER_MINUTE) {
    return "just now";
  } else if (diff < MILLISECONDS_PER_HOUR) {
    const minutes = Math.floor(diff / MILLISECONDS_PER_MINUTE);
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diff < MILLISECONDS_PER_DAY) {
    const hours = Math.floor(diff / MILLISECONDS_PER_HOUR);
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  } else if (diff < MILLISECONDS_PER_MONTH) {
    const days = Math.floor(diff / MILLISECONDS_PER_DAY);
    return `${days} ${days === 1 ? "day" : "days"} ago`;
  } else if (diff < MILLISECONDS_PER_YEAR) {
    const months = Math.floor(diff / MILLISECONDS_PER_MONTH);
    return `${months} ${months === 1 ? "month" : "months"} ago`;
  } else {
    const years = Math.floor(diff / MILLISECONDS_PER_YEAR);
    return `${years} ${years === 1 ? "year" : "years"} ago`;
  }
}

export function convertDateToTime(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
