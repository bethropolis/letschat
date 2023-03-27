import config from "./app.json"
import axios from 'axios';
const BASE_URL = config.base_url;
const api_token = config.api_key;
export async function makeRequest(endpoint, method, data = {}, headers = {}) {
  const url = new URL(`${BASE_URL}/${endpoint}/`);
  url.searchParams.append("api_key", api_token);
  const config = { method };
  config.headers = headers;
  if (method === 'GET') {
    for (const [key, value] of Object.entries(data)) {
      url.searchParams.append(key, value);
    }
  } else {
    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    config.data = formData;
  }
  return await axios(url.toString(), config);
}
