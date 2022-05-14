import axios from "axios";

export interface Props {
  url: string;
  apiKey: string;
}

let url: string = "";
let apiKey: string = "";

export const initiateApiClient = ({ url, apiKey }: Props) => {
  url = url;
  apiKey = apiKey;
}

const ApiClient = axios.create({
  baseURL: url,
  headers: {
    "Content-type": "application/json",
    "API-KEY": apiKey,
  },
});

export default ApiClient;