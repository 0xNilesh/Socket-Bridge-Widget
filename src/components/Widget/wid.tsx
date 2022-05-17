import React from "react";
import { useQuery } from "react-query";
import { getSupportedChains } from "../../services";
import { getSupportedBridges } from "../../services";
import { getUserTokenBalances } from "../../services";
import { getTokenBalanceByTokenAddress } from "../../services";
import { getTokenPriceByTokenAddress } from "../../services";
import { getGasPriceByChainId } from "../../services";
import { getIfTokenSupported } from "../../services";
import { getToTokenList } from "../../services";
import { getFromTokenList } from "../../services";

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

  const tokenPrice = useQuery(
    ["tokenPrice"],
    () => getTokenPriceByTokenAddress(
      {
        tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
        chainId: '137'
      }
    )
  );

  const gasPrice = useQuery(
    ["gasPrice"],
    () => getGasPriceByChainId(
      {
        chainId: '1'
      }
    )
  );

  const tokenSupport = useQuery(
    ["tokenSupport"],
    () => getIfTokenSupported(
      {
        chainId: '10',
        tokenAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
      }
    )
  )

  const bridgesResponse = useQuery(["bridges"], () => getSupportedBridges);

  const toTokenList = useQuery(
    ["toTokenList"],
    () => getToTokenList(
      {
        fromChainId: '10',
        toChainId: '100',
        isShortList: true
      }
    )
  );

  const fromTokenList = useQuery(
    ["fromTokenList"],
    () => getFromTokenList(
      {
        fromChainId: '10',
        toChainId: '100',
        isShortList: true
      }
    )
  );

  if (chainsResponse.isLoading) console.log("Loading...chains");
  else console.log('chain', chainsResponse.data);

  if (balanceResponse.isLoading) console.log("Loading...userBalance");
  else console.log('balance', balanceResponse.data);

  if (tokenBalance.isLoading) console.log("Loading...tokenBalance");
  else console.log('tokenBalance', tokenBalance.data);

  if (tokenPrice.isLoading) console.log("Loading...tokenPrice");
  else console.log('tokenPrice', tokenPrice.data);

  if (gasPrice.isLoading) console.log("Loading...gasPrice");
  else console.log('gasPrice', gasPrice.data);

  if (bridgesResponse.isLoading) console.log("Loading...bridges");
  else console.log('bridges', bridgesResponse.data);

  if (tokenSupport.isLoading) console.log("Loading...tokenSupport");
  else console.log('tokenSupport', tokenSupport.data);

  if (toTokenList.isLoading) console.log("Loading...toTokenList");
  else console.log('toTokenList', toTokenList.data);

  if (fromTokenList.isLoading) console.log("Loading...fromTokenList");
  else console.log('fromTokenList', fromTokenList.data);

  return <div>Hello</div>;
}

export default Wid;