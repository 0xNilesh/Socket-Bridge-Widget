import React, { useContext, useEffect, useState } from "react";
import { BridgesContext, InputTokenAmountContext, InputTokenBalanceContext, RoutesContext, TabIndexContext, useWeb3Context } from "../../contexts";
import { isValidInput } from "../../helpers";
import { PrimaryButton } from "../Button";
import BridgeTypeSort from "./BridgeTypeSort";
import ChainsSelect from "./ChainsSelect";
import TokensSelect from "./TokensSelect";

const MainComponent: React.FC = () => {
  const { selectedRoute } = useContext(RoutesContext);
  const { bridgesByName } = useContext(BridgesContext);
  const { setTabIndex } = useContext(TabIndexContext);
  const { account } = useContext(useWeb3Context);
  const { inputTokenAmount } = useContext(InputTokenAmountContext);
  const [bridgeFee, setBridgeFee] = useState("");
  const [inputTokenBalance, setInputTokenBalance] = useState("");

  let isValid = Object.keys(selectedRoute).length === 0 || inputTokenAmount === "" || !isValidInput.test(inputTokenAmount);

  // console.log("hello", selectedRoute);

  useEffect(() => {
    if (Object.keys(selectedRoute).length === 0) return;
    let userBridgeTx = {} as any;
    selectedRoute.userTxs.map((userTx: any) => {
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
    fees = (parseInt(bridgeStep.protocolFees.amount) / 10 ** (bridgeStep.protocolFees.asset.decimals)).toFixed(2).toString();
    fees += " " + bridgeStep.protocolFees.asset.symbol;
    fees += " ($" + (bridgeStep.protocolFees.feesInUsd).toString() + ")";

    setBridgeFee(fees);
  }, [selectedRoute]);

  return (
    <>
      <div className="flex flex-col">
        <BridgeTypeSort />
        <div className="h-5"></div>
        <ChainsSelect />
        <div className="h-3"></div>
        <InputTokenBalanceContext.Provider value={{inputTokenBalance, setInputTokenBalance}}>
          <TokensSelect />
        </InputTokenBalanceContext.Provider>
        <div className="h-3"></div>
        <div className="h-3"></div>
        <div className="flex flex-col text-fc text-sm font-normal">
          <div className="flex flex-row justify-between">
            <div>Bridge</div>
            {
              isValid 
                ?
                <div>
                  —
                </div>
                :
                <div className="flex flex-row">
                  <img src={bridgesByName[selectedRoute.usedBridgeNames[0]].icon} className="w-5 h-5 rounded-full mr-1 self-center" />
                  <button
                    className="text-blue-500 capitalize"
                    onClick={() => setTabIndex(1)} 
                  >
                    {bridgesByName ? bridgesByName[selectedRoute.usedBridgeNames[0]].displayName : selectedRoute.usedBridgeNames[0]}
                  </button>
                </div>
            }
          </div>
          <div className="h-4"></div>
          <div className="flex flex-row justify-between">
            <div>Transfer Time</div>
            {
              isValid 
                ? <div>—</div>
                : <div>~{ (selectedRoute.serviceTime / 60).toString() } min</div>
            }
          </div>
          <div className="h-4"></div>
          <div className="flex flex-row justify-between">
            <div>Bridge Fee</div>
            {
              isValid 
                ? <div>—</div>
                : <div>{ bridgeFee }</div>
            }
          </div>
          <div className="h-4"></div>
          <div className="flex flex-row justify-between">
            <div>Gas Fee</div>
            {
              isValid 
                ? <div>—</div>
                : <div>~ ${ (selectedRoute.totalGasFeesInUsd).toFixed(2).toString() }</div>
            }
          </div>
        </div>
        <div className="h-3"></div>
        <div className="h-3"></div>
        <div className="h-3"></div>
        <div>
          <PrimaryButton
            buttonText={`
              ${!account ? 'Connect Wallet' :
              (parseFloat(inputTokenBalance) < parseFloat(inputTokenAmount)) ? 'Not enough balance' :
                Object.keys(selectedRoute).length === 0 ? 'Select Route' :
                'Proceed'
              }
            `}
            bgColor="#e4147c"
            disabled={
              !account ||
              (parseFloat(inputTokenBalance) < parseFloat(inputTokenAmount)) ||
              Object.keys(selectedRoute).length === 0
            }
            onClick={() => setTabIndex(2)}
          />
        </div>
      </div>  
    </>
  );
};

export default MainComponent;