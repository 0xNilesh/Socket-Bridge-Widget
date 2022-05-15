import { RequestProps, getReq } from "../api";

type Props = {
  userAddress: string;
}

const getUserTokenBalances = async({userAddress}: Props) => {
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