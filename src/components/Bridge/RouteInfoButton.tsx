import React, { useContext, useEffect, useState } from "react";
import { BridgesContext, TokenDetailsContext, WidgetWidthContext } from "../../contexts";

type Props = {
  route: any;
  index: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

const RouteInfoButton: React.FC<Props> = ({ route, index, selectedIndex, setSelectedIndex }: Props) => {
  const { bridgesByName } = useContext(BridgesContext);
  const { widgetWidth } = useContext(WidgetWidthContext);
  const { outputTokenDetails } = useContext(TokenDetailsContext);
  const [bridgeFee, setBridgeFee] = useState("");

  useEffect(() => {
    if (Object.keys(route).length === 0) return;
    let userBridgeTx = {} as any;
    route.userTxs.map((userTx: any) => {
      if (userTx.userTxType === "fund-movr") {
        userBridgeTx = userTx;
      }
    });
    let bridgeStep = {} as any;
    userBridgeTx.steps.map((step: any) => {
      if (step.type === "bridge") {
        bridgeStep = step;
      }
    })

    let fees = "";
    fees += "$" + (bridgeStep.protocolFees.feesInUsd).toString();

    setBridgeFee(fees);
  }, [route]);

  return (
    <button
      className={`${widgetWidth > 500 ? 'grid grid-cols-5 gap-4' : 'flex flex-col'} px-3 py-3 rounded-lg hover:cursor-pointer w-full text-left text-sm text-textColorPrimary font-normal border ${index == selectedIndex ? "border-blue-500" : "border-bgColorSecondary"}`}
      onClick={() => setSelectedIndex(index)}
    >
      {widgetWidth > 500
        ?
        <>
          <img
            src={bridgesByName[route.usedBridgeNames[0]].icon}
            className="w-6 h-6 rounded-full self-center"
            title={bridgesByName[route.usedBridgeNames[0]].displayName}
            alt={bridgesByName[route.usedBridgeNames[0]].displayName}
          />
          <div>{(parseInt(route.toAmount) / (10 ** outputTokenDetails.decimals)).toFixed(4).toString()}</div>
          <div>~{bridgeFee}</div>
          <div>${(route.totalGasFeesInUsd).toPrecision(3).toString()}</div>
          <div>{(route.serviceTime / 60).toString()} min</div>
        </>
        :
        <>
          <div className="flex flex-row py-0.5 w-full text-xs mb-1 items-center">
            <img
              src={bridgesByName[route.usedBridgeNames[0]].icon}
              className="w-6 h-6 rounded-full self-center"
              title={bridgesByName[route.usedBridgeNames[0]].displayName}
              alt={bridgesByName[route.usedBridgeNames[0]].displayName}
            />
            <div className="ml-2 font-medium text-base">{bridgesByName[route.usedBridgeNames[0]].displayName}</div>
            <div></div>
          </div>
          <div className="flex flex-row py-0.5 w-full text-xs">
            <div className="text-textColorSecondary font-normal">Receive ({outputTokenDetails.symbol})</div>
            <div className="grow text-right">{(parseInt(route.toAmount) / (10 ** outputTokenDetails.decimals)).toFixed(4).toString()}</div>
          </div>
          <div className="flex flex-row py-0.5 w-full text-xs">
            <div className="text-textColorSecondary font-normal">Bridge Fee</div>
            <div className="grow text-right">~{bridgeFee}</div>
          </div>
          <div className="flex flex-row py-0.5 w-full text-xs">
            <div className="text-textColorSecondary font-normal">Gas Fee</div>
            <div className="grow text-right">${(route.totalGasFeesInUsd).toFixed(4).toString()}</div>
          </div>
          <div className="flex flex-row py-0.5 w-full text-xs">
            <div className="text-textColorSecondary font-normal">Time</div>
            <div className="grow text-right">{(route.serviceTime / 60).toString()} min</div>
          </div>
        </>
      }
    </button>
  )
};

export default RouteInfoButton;