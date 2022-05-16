import { RequestProps, getReq } from "../api";

type Props = {
  chainId: string;
}

const getGasPriceByChainId = async({chainId}: Props) => {
  const obj: RequestProps = {
    path: `/gas-price?&chainId=${chainId}`
  }
  const response = await getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching gas price");
  }
  return response;
}

export default getGasPriceByChainId;