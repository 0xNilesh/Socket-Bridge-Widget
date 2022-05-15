import React from "react";
import { useQuery } from "react-query";
import { getSupportedChains } from "../../services";
import { getUserTokenBalances } from "../../services";
import { getTokenBalanceByTokenAddress } from "../../services";

const Wid = () => {
  const chainsResponse = useQuery(["chains"], () => getSupportedChains);

  const balanceResponse = useQuery(
    ["userTokenBalances"],
    () => getUserTokenBalances(
      {
        userAddress: '0xcBd33769fd299cD85fa4776BFA7EE73792300C46'
      }
    )
  );
  
  const tokenBalance = useQuery(
    ["tokenBalance"],
    () => getTokenBalanceByTokenAddress(
      {
        tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        chainId: '137',
        userAddress: '0xcBd33769fd299cD85fa4776BFA7EE73792300C46'
      }
    )
  );

  if (chainsResponse.isLoading) console.log("Loading...chains");
  else console.log('chain', chainsResponse.data);

  if (balanceResponse.isLoading) console.log("Loading...userBalance");
  else console.log('balance', balanceResponse.data);

  if (tokenBalance.isLoading) console.log("Loading...tokenBalance");
  else console.log('tokenBalance', tokenBalance.data);

  return <div>Hello</div>;
}

export default Wid;