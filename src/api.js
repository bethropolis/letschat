import config from "./app.json";
import axios from "axios";

const BASE_URL = config.base_url;
const api_token = config.api_key;
const version_no = config.version_no;
const session_token = JSON.parse(localStorage.getItem("session_token")) || null;

export async function makeRequest(endpoint, method, data = {}, headers = {}) {
  let url = `${BASE_URL}/api/v${version_no}/${endpoint}/?uuid=${session_token}&`;
  const config = { method, headers };
  if (method !== "GET") {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      if (key === "file") {
        formData.append(key, value, value.name);
      } else {
        formData.append(key, value);
      }
    }
    config.headers["Content-Type"] = "multipart/form-data";
    config.data = formData;
  } else {
    const params = new URLSearchParams({ ...data });
    url += `${params.toString()}`;
  }
  config.headers.Authorization = `Bearer ${api_token}`;
  try {
    const response = await axios(url, config);
    return response;
  } catch (error) {
    console.error("Error occurred during request: ", error);
    throw error;
  }
}
