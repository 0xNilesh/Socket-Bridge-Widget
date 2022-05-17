import { RequestProps, getReq } from "../api";

type Props = {
  fromChainId: string;
  toChainId: string;
  isShortList: boolean;
}

const getToTokenList = async({fromChainId, toChainId, isShortList}: Props) => {
  const obj: RequestProps = {
    path: `/token-lists/to-token-list?fromChainId=${fromChainId}&toChainId=${toChainId}&isShortList=${isShortList}`
  }
  const response = await getReq(obj);
  
  if (!response) {
    throw new Error("Problem fetching to token list");
  }
  return response;
}

export default getToTokenList;