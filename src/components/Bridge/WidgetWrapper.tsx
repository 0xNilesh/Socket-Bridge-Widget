import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import { BridgesContext, ChainIdContext, ChainsContext, InputTokenAmountContext, PropsContext, RoutesContext, SortTypeContext, TabIndexContext, TokenDetailsContext, useWeb3Context, WidgetWidthContext } from "../../contexts";
import { getBridgeDataByBridgeName, getChainDataByChainId, updateTokenList } from "../../helpers";
import { useBoxWidth } from "../../hooks";
import { getFromTokenList, getSupportedBridges, getSupportedChains, getToTokenList } from "../../services";
import { queryResponseObj } from "../../types";
import BridgeTokens from "./BridgeTokens";
import MainComponent from "./MainComponent";
import RouteSelector from "./RouteSelector";

let inputTokenList: any;
let outputTokenList: any;

const WidgetWrapper = () => {
  const widgetProps = useContext(PropsContext);
  const ref = useRef(null);

  const bridgesResponse = useQuery(["bridges"], getSupportedBridges);
  const [bridgesByName] = getBridgeDataByBridgeName(bridgesResponse);
  
  const chainsResponse = useQuery(["chains"], getSupportedChains);
  const [chainsByChainId, fromChainsList, toChainsList] = getChainDataByChainId(chainsResponse);

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
  const widgetWidth = useBoxWidth(ref);

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
          <ChainsContext.Provider value={{ chainsByChainId, fromChainsList, toChainsList }}>
            <ChainIdContext.Provider value={{ inputChainId, setInputChainId, outputChainId, setOutputChainId }}>
              <InputTokenAmountContext.Provider value={{ inputTokenAmount, setInputTokenAmount, inputTokenList, outputTokenList }}>
                <TokenDetailsContext.Provider value={{ inputTokenDetails, setInputTokenDetails, outputTokenDetails, setOutputTokenDetails }}>
                  <RoutesContext.Provider value={{ selectedRoute, routes, setRoutes, setSelectedRoute }}>
                    <SortTypeContext.Provider value={{ sortType, setSortType }}>
                      <WidgetWidthContext.Provider value={{widgetWidth}}>
                        <div
                          style={{ width: '100%' }}
                          className="rounded-xl bg-bgColorPrimary p-6"
                          ref={ref}
                        >
                          {tabIndex === 0 && <MainComponent />}
                          {tabIndex === 1 && <RouteSelector />}
                          {tabIndex === 2 && <BridgeTokens />}
                        </div>
                      </WidgetWidthContext.Provider>
                    </SortTypeContext.Provider>
                  </RoutesContext.Provider>
                </TokenDetailsContext.Provider>
              </InputTokenAmountContext.Provider>
            </ChainIdContext.Provider>
          </ChainsContext.Provider>
        </BridgesContext.Provider>
      </TabIndexContext.Provider>
    </>
  );
}

export default WidgetWrapper;