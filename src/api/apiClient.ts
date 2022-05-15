import axios from "axios";

const url: string = "https://backend.movr.network/v2";

const ApiClient = () => {
  const apiKey = sessionStorage.getItem('apiKey');
  console.log(apiKey);
  if (!apiKey) return;

  return axios.create({
    baseURL: url,
    headers: {
      "Content-type": "application/json",
      "API-KEY": apiKey ?? ''
    },
  });
}

export default ApiClient;