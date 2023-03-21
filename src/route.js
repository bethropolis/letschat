import { navigate } from "svelte-routing";

export function nav(location, params) {
  // Construct the path to the route using the location and parameters
  const path = location + (params ? "?" + new URLSearchParams(params) : "");

  // Use the navigate function from svelte-routing to navigate to the path
  navigate(path);
}

// redirect to login page if not logged in
export function redirectIfNotLoggedIn() {
  if (!localStorage.getItem("login")) {
    navigate("/login");
  }
}

// determine if user is logged in
export function isLoggedIn() {
  return localStorage.getItem("login");
}

export function isCurrentPage(location) {
  // check if the current route is location  else return false
  if (window.location.pathname === `/${location}`) {
    return true;
  } else {
    return false;
  }
}

