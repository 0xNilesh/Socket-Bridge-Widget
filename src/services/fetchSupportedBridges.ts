import { RequestProps, getReq } from "../api";

const getSupportedBridges = async () => {
  const obj: RequestProps = {
    path: '/supported/bridges'
  }
  const response = await getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching supported bridges");
  }
  return response;
}

export default getSupportedBridges;