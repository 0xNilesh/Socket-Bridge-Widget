import { RequestProps, getReq } from "../api";

const getSupportedBridges = () => {
  const obj: RequestProps = {
    path: '/supported/bridges'
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching supported bridges");
  }
  return response;
}

export default getSupportedBridges;