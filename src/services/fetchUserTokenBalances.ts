import { RequestProps, getReq } from "../api";

const getUserTokenBalances = async (userAddress: string) => {
  const obj: RequestProps = {
    path: `balances?userAddress=${userAddress}`
  }
  const response = await getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching user token balances");
  }
  return response;
}

export default getUserTokenBalances;