import React, { createContext, useContext, useState } from "react";
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
import GasSelector from "./GasSelector";
import MainComponent from "./MainComponent";
import RouteSelector from "./RouteSelector";

import { PropsContext } from "./Widget";

export type ChainIdContent = {
  inputChainId: number;
  outputChainId: number;
  setInputChainId: (chainId: number) => void;
  setOutputChainId: (chainId: number) => void;
}

export type TabIndexContent = {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export const TabIndexContext = createContext<TabIndexContent>({
  tabIndex: 0,
  setTabIndex: () => {}
});

export const ChainIdContext = createContext<ChainIdContent>({
  inputChainId: 1,
  outputChainId: 137,
  setInputChainId: () => {},
  setOutputChainId: () => {}
});

const WidgetWrapper = () => {
  const widgetProps = useContext(PropsContext);
  // const chainsResponse = useQuery(["chains"], getSupportedChains);
  // const bridgesResponse = useQuery(["bridges"], getSupportedBridges);

  // const balanceResponse = useQuery(
  //   ["userTokenBalances"],
  //   () => getUserTokenBalances(
  //     {
  //       userAddress: '0xcBd33769fd299cD85fa4776BFA7EE73792300C46'
  //     }
  //   )
  // );
  // console.log(balanceResponse, chainsResponse, bridgesResponse);
  
  // const tokenBalance = useQuery(
  //   ["tokenBalance"],
  //   () => getTokenBalanceByTokenAddress(
  //     {
  //       tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  //       chainId: '137',
  //       userAddress: '0xcBd33769fd299cD85fa4776BFA7EE73792300C46'
  //     }
  //   )
  // );

  // const tokenPrice = useQuery(
  //   ["tokenPrice"],
  //   () => getTokenPriceByTokenAddress(
  //     {
  //       tokenAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  //       chainId: '137'
  //     }
  //   )
  // );

  // const gasPrice = useQuery(
  //   ["gasPrice"],
  //   () => getGasPriceByChainId(
  //     {
  //       chainId: '1'
  //     }
  //   )
  // );

  // const tokenSupport = useQuery(
  //   ["tokenSupport"],
  //   () => getIfTokenSupported(
  //     {
  //       chainId: '10',
  //       tokenAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
  //     }
  //   )
  // )

  // const bridgesResponse = useQuery(["bridges"], () => getSupportedBridges);

  // const toTokenList = useQuery(
  //   ["toTokenList"],
  //   () => getToTokenList(
  //     {
  //       fromChainId: '10',
  //       toChainId: '100',
  //       isShortList: true
  //     }
  //   )
  // );

  // const fromTokenList = useQuery(
  //   ["fromTokenList"],
  //   () => getFromTokenList(
  //     {
  //       fromChainId: '10',
  //       toChainId: '100',
  //       isShortList: true
  //     }
  //   )
  // );

  // if (chainsResponse.isLoading) console.log("Loading...chains");
  // else console.log('chain', chainsResponse.data);

  // if (balanceResponse.isLoading) console.log("Loading...userBalance");
  // else console.log('balance', balanceResponse.data);

  // if (tokenBalance.isLoading) console.log("Loading...tokenBalance");
  // else console.log('tokenBalance', tokenBalance.data);

  // if (tokenPrice.isLoading) console.log("Loading...tokenPrice");
  // else console.log('tokenPrice', tokenPrice.data);

  // if (gasPrice.isLoading) console.log("Loading...gasPrice");
  // else console.log('gasPrice', gasPrice.data);

  // if (bridgesResponse.isLoading) console.log("Loading...bridges");
  // else console.log('bridges', bridgesResponse.data);

  // if (tokenSupport.isLoading) console.log("Loading...tokenSupport");
  // else console.log('tokenSupport', tokenSupport.data);

  // if (toTokenList.isLoading) console.log("Loading...toTokenList");
  // else console.log('toTokenList', toTokenList.data);

  // if (fromTokenList.isLoading) console.log("Loading...fromTokenList");
  // else console.log('fromTokenList', fromTokenList.data);

  const [tabIndex, setTabIndex] = useState(0);
  const [inputChainId, setInputChainId] = useState((widgetProps as any).defaultInputChainId);
  const [outputChainId, setOutputChainId] = useState((widgetProps as any).defaultOutputChainId);

  return (
    <>
      <TabIndexContext.Provider value={{ tabIndex, setTabIndex }}>
        <ChainIdContext.Provider value={{ inputChainId, setInputChainId, outputChainId, setOutputChainId }}>
          <div style={{width: '528px', height: '538px'}} className="rounded-xl bg-pr ml-32 p-6">
            {tabIndex === 0 && <MainComponent />}
            {tabIndex === 1 && <RouteSelector />}
            {tabIndex === 2 && <GasSelector />}
          </div>
        </ChainIdContext.Provider>
      </TabIndexContext.Provider>
    </>
  );
}

export default WidgetWrapper;