import { RequestProps, getReq } from "../api";

type Props = {
  chainId: string;
  owner: string;
  allowanceTarget: string;
  tokenAddress: string;
}

const getAllowanceDetail = ({ chainId, owner, allowanceTarget, tokenAddress }: Props) => {
  const obj: RequestProps = {
    path: `/approval/check-allowance?chainID=${chainId}&owner=${owner}&allowanceTarget=${allowanceTarget}&tokenAddress=${tokenAddress}`
  }
  const response = getReq(obj);
  
  if (!response) {
    throw new Error("Problem checking allowance");
  }
  return response;
}

export default getAllowanceDetail;