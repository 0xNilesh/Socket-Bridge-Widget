import { RequestProps, getReq } from "../api";

type Props = {
  tokenAddress: string;
  chainId: string;
}

const getIfTokenSupported = ({ tokenAddress, chainId }: Props) => {
  const obj: RequestProps = {
    path: `/supported/token-support?chainId=${chainId}&address=${tokenAddress}`
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching if token is supported");
  }
  return response;
}

export default getIfTokenSupported;