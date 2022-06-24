import { RequestProps, postReq } from "../api";
import { Obj } from "../types";

type Props = {
  route: any
}

const getRouteTransactionData = ({ route }: Props) => {
  const obj: RequestProps = {
    path: `/build-tx`,
    body: {"route": route}
  }
  const response: any = postReq(obj);
  // console.log(response);
  
  if (!response) {
    throw new Error("Problem fetching route transaction data");
  }
  // console.log(response.data)
  return response;
}

export default getRouteTransactionData;