import axios from 'axios';

const BASE_URL = 'https://bethro.alwaysdata.net/api/v1';
const api_token = 'b2f4cb3083ca8588a5a6ca1dbd97e1f5947fefac3ecd76ff10b98400f1e3e7b0';
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
