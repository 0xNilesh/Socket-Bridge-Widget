import { RequestProps, getReq } from "../api";

async function getSupportedChains() {
  const obj: RequestProps = {
    path: '/supported/chains'
  }
  const response = await getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching chains data");
  }
  return response;
}

export default getSupportedChains;