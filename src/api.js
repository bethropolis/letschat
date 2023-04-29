import config from "./app.json";
import axios from "axios";

const BASE_URL = config.base_url;
const api_token = config.api_key;
const version_no = config.version_no;

export async function makeRequest(endpoint, method, data = {}, headers = {}) {
  const params = new URLSearchParams({ api_key: api_token, ...data });
  const url = `${BASE_URL}/api/v${version_no}/${endpoint}/?${params.toString()}`;
  const config = { method, headers };
  if (method !== "GET") {
    config.headers["Content-Type"] = "application/x-www-form-urlencoded";
    config.data = params.toString();
  }
  return await axios(url, config);
}

