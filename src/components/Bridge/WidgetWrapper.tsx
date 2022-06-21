import React, { createContext, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getBridgeDataByBridgeName, updateTokenList } from "../../helpers";
import { getFromTokenList, getSupportedBridges, getToTokenList } from "../../services";
import { ChainIdContent, InputTokenAmountContent, queryResponseObj, RoutesContent, SortTypeContent, TabIndexContent, TokenDetailsContent } from "../../types";
import GasSelector from "./GasSelector";
import MainComponent from "./MainComponent";
import RouteSelector from "./RouteSelector";

import { PropsContext, useWeb3Context } from "./Widget";

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

export const InputTokenAmountContext = createContext<InputTokenAmountContent>({
  inputTokenAmount: "",
  setInputTokenAmount: () => { },
  inputTokenList: {},
  outputTokenList: {}
});

export const RoutesContext = createContext<RoutesContent>({
  selectedRoute: {} as any,
  routes: [],
  setRoutes: (routes: []) => { },
  setSelectedRoute: (routes: any) => { }
});

export const BridgesContext = createContext({
  bridgesByName: {} as any
});

export const SortTypeContext = createContext<SortTypeContent>({
  sortType: "output",
  setSortType: () => {}
});

let inputTokenList: any;
let outputTokenList: any;

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

  const [tabIndex, setTabIndex] = useState(0);
  const [inputChainId, setInputChainId] = useState((widgetProps as any).defaultInputChainId);
  const [outputChainId, setOutputChainId] = useState((widgetProps as any).defaultOutputChainId);
  const [inputTokenDetails, setInputTokenDetails] = useState({ address: "", symbol: "", icon: "", decimals: 0 });
  const [outputTokenDetails, setOutputTokenDetails] = useState({ address: "", symbol: "", icon: "", decimals: 0 });
  const [inputTokenAmount, setInputTokenAmount] = useState("");
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState({});
  const [sortType, setSortType] = useState("output" as any);
  const { account } = useContext(useWeb3Context);

  const fromTokenList: queryResponseObj = useQuery(
    ["fromTokenList", inputChainId],
      () => getFromTokenList(
        {
          fromChainId: inputChainId.toString(),
          toChainId: outputChainId.toString(),
          isShortList: true
        }
      ), {
      enabled: !!(inputChainId)
    }
  );

  const toTokenList: queryResponseObj = useQuery(
    ["toTokenList", outputChainId],
    () => getToTokenList(
      {
        fromChainId: inputChainId.toString(),
        toChainId: outputChainId.toString(),
        isShortList: true
      }
    ),
    {
      enabled: !!(outputChainId)
    }
  );

  useEffect(() => {
    if (fromTokenList.isSuccess) {
      inputTokenList = fromTokenList.data?.data?.result;
      const { address, icon, symbol, decimals } = inputTokenList.filter((token: any) => (token.symbol === 'USDC'))[0];
      console.log(address, icon, symbol);
      setInputTokenDetails({ address, icon, symbol, decimals });
      inputTokenList = updateTokenList(inputChainId, inputTokenList, account);
    }
  }, [fromTokenList.isSuccess, inputChainId]);

  useEffect(() => {
    if (toTokenList.isSuccess) {
      outputTokenList = toTokenList.data?.data?.result;
      const { address, icon, symbol, decimals } = outputTokenList.filter((token: any) => (token.symbol === 'USDC'))[0];
      setOutputTokenDetails({ address, icon, symbol, decimals });
      outputTokenList = updateTokenList(outputChainId, outputTokenList, account);
    }
  }, [toTokenList.isSuccess, outputChainId]);

  return (
    <>
      <TabIndexContext.Provider value={{ tabIndex, setTabIndex }}>
        <BridgesContext.Provider value={{ bridgesByName }}>
          <ChainIdContext.Provider value={{ inputChainId, setInputChainId, outputChainId, setOutputChainId }}>
            <InputTokenAmountContext.Provider value={{ inputTokenAmount, setInputTokenAmount, inputTokenList, outputTokenList }}>
              <TokenDetailsContext.Provider value={{ inputTokenDetails, setInputTokenDetails, outputTokenDetails, setOutputTokenDetails }}>
                <RoutesContext.Provider value={{ selectedRoute, routes, setRoutes, setSelectedRoute }}>
                  <SortTypeContext.Provider value={{ sortType, setSortType }}>
                    <div style={{width: '528px', marginTop: "50px"}} className="rounded-xl bg-pr ml-32 p-6">
                      {tabIndex === 0 && <MainComponent />}
                      {tabIndex === 1 && <RouteSelector />}
                      {tabIndex === 2 && <GasSelector />}
                    </div>
                  </SortTypeContext.Provider>
                </RoutesContext.Provider>
              </TokenDetailsContext.Provider>
            </InputTokenAmountContext.Provider>
          </ChainIdContext.Provider>
        </BridgesContext.Provider>
      </TabIndexContext.Provider>
    </>
  );
}

export default React.memo(WidgetWrapper);