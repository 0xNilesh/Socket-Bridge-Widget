import React, { useContext, useEffect, useState } from "react";
import { BridgesContext, TokenDetailsContext } from "./WidgetWrapper";

type Props = {
  route: any;
  index: number;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
};

const RouteInfoButton: React.FC<Props> = ({ route, index, selectedIndex, setSelectedIndex }: Props) => {
  const { bridgesByName } = useContext(BridgesContext);
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
      className={`grid grid-cols-5 gap-4 px-3 py-3 rounded-lg hover:cursor-pointer w-full text-left text-sm text-fc font-normal border ${index == selectedIndex ? "border-blue-500" : "border-bgLight"}`}
      onClick={() => setSelectedIndex(index)}
    >
      <img
        src={bridgesByName[route.usedBridgeNames[0]].icon}
        className="w-6 h-6 rounded-full self-center"
        title={bridgesByName[route.usedBridgeNames[0]].displayName}
        alt={bridgesByName[route.usedBridgeNames[0]].displayName}
      />
      <div>{(parseInt(route.toAmount) / (10 ** outputTokenDetails.decimals)).toFixed(2).toString()}</div>
      <div>~{bridgeFee}</div>
      <div>${(route.totalGasFeesInUsd).toPrecision(3).toString()}</div>
      <div>{(route.serviceTime / 60).toString()} min</div>
    </button>
  )
};

export default RouteInfoButton;