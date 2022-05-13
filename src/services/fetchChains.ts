import axios from "axios";

async function getSupportedChains() {
  const response = await axios.get(`https://backend.movr.network/v2/supported/chains`, {
    headers: {
      'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c'
    }
  });
  if (!response) {
    throw new Error("Problem fetching chains data");
  }
  return response;
}

export default getSupportedChains;