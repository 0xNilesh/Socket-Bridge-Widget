import React from "react";
import { useQuery } from "react-query";
import { getSupportedChains } from "../../services";
import { getUserTokenBalances } from "../../services";

const Wid = () => {
  const chainsResponse = useQuery(["chains"], getSupportedChains);
  const balanceResponse = useQuery(["userTokenBalances"], () => getUserTokenBalances('0xcBd33769fd299cD85fa4776BFA7EE73792300C46'));

  if (chainsResponse.isLoading) console.log("Loading...chains");
  else console.log('', chainsResponse.data);

  if (balanceResponse.isLoading) console.log("Loading...tokenBalance");
  else console.log('', balanceResponse.data);

  return <div>Hello</div>;
}

export default Wid;