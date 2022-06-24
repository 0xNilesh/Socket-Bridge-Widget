import React, { useContext } from "react";
import { useMutation, useQuery } from "react-query";
import DownArrowSvg from "../../assets/down-arrow.svg";
import { BridgesContext, ChainIdContext, ChainsContext, RoutesContext, TabIndexContext, TokenDetailsContext } from "../../contexts";
import { getRouteTransactionData } from "../../services";

import { queryResponseObj } from "../../types";

const BridgeTokens = () => {
  const { setTabIndex } = useContext(TabIndexContext);
  const { selectedRoute } = useContext(RoutesContext);
  const { bridgesByName } = useContext(BridgesContext);
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { chainsByChainId } = useContext(ChainsContext);
  const { inputTokenDetails, outputTokenDetails } = useContext(TokenDetailsContext);

  const inputAmountSimplified = (parseFloat(selectedRoute.fromAmount) / (10 ** inputTokenDetails.decimals)).toFixed(2).toString() + " " + inputTokenDetails.symbol;
  const outputAmountSimplified = (parseFloat(selectedRoute.toAmount) / (10 ** outputTokenDetails.decimals)).toFixed(2).toString() + " " + outputTokenDetails.symbol;
  const bridgeName = bridgesByName[selectedRoute.usedBridgeNames[0]].displayName;

   const routeTxData = useMutation(["routeTxData"],
    getRouteTransactionData, {
    onSuccess: (data) => {
      console.log(data);
    },
  }
    );
  
  routeTxData.mutate({ route: selectedRoute });
  console.log(routeTxData);

  return (
    <div>
      <div className="flex flex-row" id="bridge-header">
        <button
          className="w-6 h-6 rounded-md hover:bg-bgLight hover:cursor-pointer mr-2 text-fc flex justify-center items-center"
          onClick={() => setTabIndex(0)}
        >
          <DownArrowSvg className="rotate-180" style={{width: 9, height: 14}} />
        </button>
        <div className="grow text-center text-xl text-fc font-medium">
          Bridge
        </div>
      </div>
      <div className="h-3"></div>
      <div className="h-4"></div>
      <div className="text-fc text-base font-medium">Bridge Info</div>
      <div className="text-bg3 test-xs font-normal py-1">{inputAmountSimplified} on {chainsByChainId[inputChainId]["name"]} to {outputAmountSimplified} on {chainsByChainId[outputChainId]["name"]} via {bridgeName} bridge</div>
    </div>
  );
};

export default BridgeTokens;