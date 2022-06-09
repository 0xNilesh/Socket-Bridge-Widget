import axios from "axios";

const BASE_URL: string = "https://api.socket.tech/v2";

const ApiClient = () => {
  const apiKey = sessionStorage.getItem('apiKey');
  console.log(apiKey);
  if (!apiKey) return;

  return axios.create({
    baseURL: BASE_URL,
    headers: {
      "Content-type": "application/json",
      "API-KEY": apiKey ?? ''
    },
  });
}

export default ApiClient;