import { RequestProps, getReq } from "../api";

type Props = {
  fromChainId: string;
  fromTokenAddress: string;
  toChainId: string;
  toTokenAddress: string;
  fromAmount: string;
  userAddress: string;
  uniqueRoutesPerBridge: boolean;
  sort: 'output' | 'gas' | 'time';
  singleTxOnly: boolean;
}

const getQuote = ({ fromChainId,
  fromTokenAddress,
  toChainId,
  toTokenAddress,
  fromAmount,
  userAddress,
  uniqueRoutesPerBridge,
  sort,
  singleTxOnly
}: Props) => {
  
  const obj: RequestProps = {
    path: `/quote?fromChainId=${fromChainId}&fromTokenAddress=${fromTokenAddress}&toChainId=${toChainId}&toTokenAddress=${toTokenAddress}&fromAmount=${fromAmount}&userAddress=${userAddress}&uniqueRoutesPerBridge=${uniqueRoutesPerBridge}&sort=${sort}&singleTxOnly=${singleTxOnly}`
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching quotes");
  }
  return response;
}

export default getQuote;