export function formatTime(timestamp) {
 const time = Date.parse(timestamp);
 const date = new Date(time);
  const now = Date.now();
  // @ts-ignore
  const diff = now - date;
  if (isNaN(diff)) {
    return '';
  } else if (diff < 60 * 1000) {
    return 'just now';
  } else if (diff < 60 * 60 * 1000) {
    const minutes = Math.floor(diff / (60 * 1000));
    return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else if (diff < 30 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  } else if (diff < 365 * 24 * 60 * 60 * 1000) {
    const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000));
    return `${months} ${months === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000));
    return `${years} ${years === 1 ? 'year' : 'years'} ago`;
  }
}

export function convertDateToTime(dateString) {
  // Create a new Date object from the date string
  const date = new Date(dateString);

  // Get the hours and minutes from the date object
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Determine whether it's AM or PM
  const ampm = hours >= 12 ? 'PM' : 'AM';

  // Convert the hours to 12-hour format
  const formattedHours = hours % 12 || 12;

  // Pad the minutes with a leading zero if necessary
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  // Return the formatted time string
  return `${formattedHours}:${formattedMinutes} ${ampm}`;
}
