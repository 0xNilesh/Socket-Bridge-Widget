import { RequestProps, getReq } from "../api";

type Props = {
  chainId: string;
}

const getGasPriceByChainId = ({ chainId }: Props) => {
  const obj: RequestProps = {
    path: `/gas-price?&chainId=${chainId}`
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching gas price");
  }
  return response;
}

export default getGasPriceByChainId;