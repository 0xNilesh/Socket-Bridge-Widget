import { RequestProps, getReq } from "../api";

type Props = {
  fromChainId: string;
  toChainId: string;
  isShortList: boolean;
}

const getFromTokenList = async({fromChainId, toChainId, isShortList}: Props) => {
  const obj: RequestProps = {
    path: `/token-lists/from-token-list?fromChainId=${fromChainId}&toChainId=${toChainId}&isShortList=${isShortList}`
  }
  const response = await getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching from token list");
  }
  return response;
}

export default getFromTokenList;