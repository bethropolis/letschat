import { navigate } from "svelte-routing";

export function nav(location = "", params = null) {
  if (location == "intro") {
    return navigate("/");
  }

  // Construct the path to the route using the location and parameters
  const path =
    "/" + location + (params ? "?" + new URLSearchParams(params) : "");

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

export function isCurrentPage(location, param = null) {
  // check if the current route is location  else return false
  if (window.location.pathname !== `/${location}`) return;
  // check if the current route has a parameter
  if (param) {
    let url = new URLSearchParams(window.location.search);
    if (!url.has(param)) return;
    return true;
  }
  return true;
}

// chech params
export function checkParams(param = null) {
  const urlParams = new URLSearchParams(window.location.search);
  if (param) {
    if (!urlParams.has(param)) return;
    return urlParams.get(param);
  }
}
