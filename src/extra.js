import { DB } from "./db";
import { nav } from "./route";

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




export const logout = function () {
  try {
    const loggedInUser = DB("get", "login");
    if (!loggedInUser) {
      return;
    }
    const existingAcc = DB("get", "extAcc");
    if (!existingAcc) {
      return DB("clear");
    }
    const filteredUsers = existingAcc.users.filter(
      (user) => user.username !== loggedInUser.username
    );
    DB("clear");
    DB("update", "extAcc", { users: filteredUsers });
  } catch (error) {
    console.error(`Error occurred while logging out: ${error}`);
  }
};

// Validate a username
export function isValidUsername(username) {
  // Check if the username is at least 3 characters long
  if (username.length < 3) {
    return "Username must be at least 3 characters long.";
  }
  // Check if the username contains only letters, numbers, and underscores
  else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return "Hmm, that doesn't look like a valid username.";
  }
  // Otherwise, the username is valid
  else {
    return "";
  }
}

// Validate an email address
export function isValidEmail(email) {
  // Check if the email address is valid
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return "Please enter a valid email address, like name@example.com.";
  }
  // Otherwise, the email address is valid
  else {
    return "";
  }
}

// Validate a password
export function getPasswordStrength(password) {
  // Check if the password is less than 5 characters long
  if (password.length < 5) {
    return "Very weak";
  }
  // Check if the password is at least 5 characters long and contains at least one number or capital letter
  else if (password.length >= 5 && !/(?=.*[0-9A-Z])/g.test(password)) {
    return "Fair";
  }
  // Check if the password is at least 8 characters long and contains at least one uppercase letter, one lowercase letter, one number, and one special character
  else if (
    password.length >= 5 &&
    !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+=[\]{};':"\\|,.<>/?-])/g.test(
      password
    )
  ) {
    return "Medium";
  }
  // Otherwise, the password is strong
  else {
    return "Strong";
  }
}

export function checkFileExtension(name) {
  const imageExtensions = ["jpg", "jpeg", "png", "gif"];
  const videoExtensions = ["mp4", "avi", "mov", "wmv"];
  const audioExtensions = ["mp3", "wav", "ogg", "aac"];
  const extension = name.split(".").pop().toLowerCase();
  if (imageExtensions.includes(extension)) {
    return "img";
  } else if (videoExtensions.includes(extension)) {
    return "vid";
  } else if (audioExtensions.includes(extension)) {
    return "mus";
  } else {
    return "txt";
  }
}
