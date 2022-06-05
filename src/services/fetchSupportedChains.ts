import { RequestProps, getReq } from "../api";

const getSupportedChains = () => {
  const obj: RequestProps = {
    path: '/supported/chains'
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching supported chains");
  }
  return response;
}

export default getSupportedChains;