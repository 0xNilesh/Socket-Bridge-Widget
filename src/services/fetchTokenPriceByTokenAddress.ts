import { RequestProps, getReq } from "../api";

type Props = {
  tokenAddress: string;
  chainId: string;
}

const getTokenPriceByTokenAddress = ({ tokenAddress, chainId }: Props) => {
  const obj: RequestProps = {
    path: `/token-price?tokenAddress=${tokenAddress}&chainId=${chainId}`
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching token price");
  }
  return response;
}

export default getTokenPriceByTokenAddress;