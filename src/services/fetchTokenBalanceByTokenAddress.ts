import { RequestProps, getReq } from "../api";

type Props = {
  tokenAddress: string;
  chainId: string;
  userAddress: string;
}

const getTokenBalanceByTokenAddress = ({ tokenAddress, chainId, userAddress }: Props) => {
  const obj: RequestProps = {
    path: `balances/token-balance?tokenAddress=${tokenAddress}&chainId=${chainId}&userAddress=${userAddress}`
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching token balance");
  }
  return response;
}

export default getTokenBalanceByTokenAddress;