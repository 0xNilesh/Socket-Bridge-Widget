import { RequestProps, getReq } from "../api";

type Props = {
  transactionHash: any;
  fromChainId: string;
  toChainId: string;
}

const getBridgeStatus = ({ transactionHash, fromChainId, toChainId }: Props) => {
  const obj: RequestProps = {
    path: `bridge-status?transactionHash=${transactionHash}&fromChainId=${fromChainId}&toChainId=${toChainId}`
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem getting bridge tx status");
  }
  return response;
}

export default getBridgeStatus;