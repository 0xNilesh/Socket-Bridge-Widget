import React, { createContext, useContext, useState } from "react";
import { useQuery } from "react-query";
import { getBridgeDataByBridgeName } from "../../helpers";
import { getQuote, getSupportedChains } from "../../services";
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

interface TokenDetail {
  address: string,
  symbol: string,
  icon: string,
  decimals: number
}

export type TokenDetailsContent = {
  inputTokenDetails: TokenDetail;
  outputTokenDetails: TokenDetail;
  setInputTokenDetails: (Obj: TokenDetail) => void;
  setOutputTokenDetails: (Obj: TokenDetail) => void;
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

export const TokenDetailsContext = createContext<TokenDetailsContent>({
  inputTokenDetails: { address: "", symbol: "", icon: "", decimals: 0 },
  outputTokenDetails: { address: "", symbol: "", icon: "", decimals: 0 },
  setInputTokenDetails: () => { },
  setOutputTokenDetails: () => { }
});

export const RoutesContext = createContext({
  selectedRoute: {} as any,
  routes: [],
  setRoutes: (routes: []) => { },
  setSelectedRoute: (routes: any) => { }
});

export const BridgesContext = createContext({
  bridgesByName: {} as any
});

const WidgetWrapper = () => {
  const widgetProps = useContext(PropsContext);

  // const gasPrice = useQuery(
  //   ["gasPrice"],
  //   () => getGasPriceByChainId(
  //     {
  //       chainId: '1'
  //     }
  //   )
  // );

  const bridgesResponse = useQuery(["bridges"], getSupportedBridges);
  const [ bridgesByName ] = getBridgeDataByBridgeName(bridgesResponse);

  // if (gasPrice.isLoading) console.log("Loading...gasPrice");
  // else console.log('gasPrice', gasPrice.data);

  // if (bridgesResponse.isLoading) console.log("Loading...bridges");
  // else console.log('bridges', bridgesResponse.data);

  const [tabIndex, setTabIndex] = useState(0);
  const [inputChainId, setInputChainId] = useState((widgetProps as any).defaultInputChainId);
  const [outputChainId, setOutputChainId] = useState((widgetProps as any).defaultOutputChainId);
  const [inputTokenDetails, setInputTokenDetails] = useState({ address: "", symbol: "", icon: "", decimals: 0 });
  const [outputTokenDetails, setOutputTokenDetails] = useState({ address: "", symbol: "", icon: "", decimals: 0 });
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState({});

  return (
    <>
      <TabIndexContext.Provider value={{ tabIndex, setTabIndex }}>
        <BridgesContext.Provider value={{ bridgesByName }}>
          <ChainIdContext.Provider value={{ inputChainId, setInputChainId, outputChainId, setOutputChainId }}>
            <TokenDetailsContext.Provider value={{ inputTokenDetails, setInputTokenDetails, outputTokenDetails, setOutputTokenDetails }}>
              <RoutesContext.Provider value={{ selectedRoute, routes, setRoutes, setSelectedRoute }}>
                <div style={{width: '528px', height: '538px', marginTop: "50px"}} className="rounded-xl bg-pr ml-32 p-6">
                  {tabIndex === 0 && <MainComponent />}
                  {tabIndex === 1 && <RouteSelector />}
                  {tabIndex === 2 && <GasSelector />}
                </div>
              </RoutesContext.Provider>
            </TokenDetailsContext.Provider>
          </ChainIdContext.Provider>
        </BridgesContext.Provider>
      </TabIndexContext.Provider>
    </>
  );
}

export default React.memo(WidgetWrapper);