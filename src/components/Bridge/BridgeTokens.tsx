import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import DownArrowSvg from "../../assets/down-arrow.svg";
import { BridgesContext, ChainIdContext, ChainsContext, RoutesContext, TabIndexContext, TokenDetailsContext, useWeb3Context } from "../../contexts";
import { getAllowanceDetail, getRouteTransactionData } from "../../services";

import { queryResponseObj } from "../../types";
import { PrimaryButton } from "../Button";
let allowanceAmount: queryResponseObj;

const BridgeTokens = () => {
  const { account } = useContext(useWeb3Context);
  const { setTabIndex } = useContext(TabIndexContext);
  const { selectedRoute } = useContext(RoutesContext);
  const { bridgesByName } = useContext(BridgesContext);
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { chainsByChainId } = useContext(ChainsContext);
  const { inputTokenDetails, outputTokenDetails } = useContext(TokenDetailsContext);
  const [btn, setBtn] = useState(0);
  const [loading, setLoading] = useState(true);
  const [allowanceTarget, setAllowanceTarget] = useState(null);
  const [minimumApprovalAmount, setMinimumApprovalAmount] = useState(null);
  const [approveBtnText, setApproveBtnText] = useState("Approve");
  const [bridgeBtnText, setBridgeBtnText] = useState("Bridge");
  const [hideApproveBtn, setHideApproveBtn] = useState(true);
  const [hideBridgeBtn, setHideBridgeBtn] = useState(true);
  const [disabledApproveBtn, setDisabledApproveBtn] = useState(false);
  const [disabledBridgeBtn, setDisabledBridgeBtn] = useState(false);

  const isFirstMount = useRef(true);

  const inputAmountSimplified = (parseFloat(selectedRoute.fromAmount) / (10 ** inputTokenDetails.decimals)).toFixed(2).toString() + " " + inputTokenDetails.symbol;
  const outputAmountSimplified = (parseFloat(selectedRoute.toAmount) / (10 ** outputTokenDetails.decimals)).toFixed(2).toString() + " " + outputTokenDetails.symbol;
  const bridgeName = bridgesByName[selectedRoute.usedBridgeNames[0]].displayName;

  allowanceAmount = useQuery(["checkAllowance"],
    () => getAllowanceDetail({
      chainId: inputChainId.toString(),
      owner: account,
      allowanceTarget: allowanceTarget,
      tokenAddress: inputTokenDetails.address
    }), {
      enabled: !!(allowanceTarget !== null)
    }
  );

  const routeTxData = useMutation(["routeTxData"],
      getRouteTransactionData, {
        onSuccess: (data: any) => {
          setLoading(false);
          const { allowanceTarget, minimumApprovalAmount } = data.data.result.approvalData;
          console.log(allowanceTarget, minimumApprovalAmount);
          setMinimumApprovalAmount(minimumApprovalAmount);
          if (allowanceTarget === null) {
            setHideBridgeBtn(false);
          } else {
            setAllowanceTarget(allowanceTarget);
          }
      },
    }
  );

  useEffect(() => {
    if (allowanceAmount.isSuccess) {
      const allowanceValue = parseInt(allowanceAmount.data?.data?.result?.value);
      if (minimumApprovalAmount != null && parseInt(minimumApprovalAmount) > allowanceValue) {
        setDisabledBridgeBtn(true);
        setHideApproveBtn(false);
        setHideBridgeBtn(false);
      } else if(minimumApprovalAmount != null && parseInt(minimumApprovalAmount) <= allowanceValue) {
        setHideBridgeBtn(false);
      }
      console.log(allowanceValue);
    }
  }, [allowanceAmount.isSuccess]);

  // run this effect on only first mount of this component
  useEffect(() => {
    if (isFirstMount.current) {
      routeTxData.mutate({ route: selectedRoute });
      isFirstMount.current = false;
    }
  }, [isFirstMount]);

  return (
    <div>
      <div className="flex flex-row" id="bridge-header">
        <button
          className="w-6 h-6 rounded-md hover:bg-bgLight hover:cursor-pointer mr-2 text-fc flex justify-center items-center"
          onClick={() => setTabIndex(0)}
        >
          <DownArrowSvg className="rotate-180" style={{ width: 9, height: 14 }} />
        </button>
        <div className="grow text-center text-xl text-fc font-medium">
          Bridge
        </div>
      </div>
      <div className="h-3"></div>
      <div className="h-4"></div>
      <div className="text-fc text-base font-medium">Bridge Info</div>
      <div className="text-bg3 test-xs font-normal py-1">{inputAmountSimplified} on {chainsByChainId[inputChainId]["name"]} to {outputAmountSimplified} on {chainsByChainId[outputChainId]["name"]} via {bridgeName} bridge</div>
      {loading && hideApproveBtn && hideBridgeBtn && <div className="text-fc text-base font-medium mt-4 mb-4">Loading</div>}
      {!hideApproveBtn &&
        <PrimaryButton
          buttonText={approveBtnText}
          bgColor="#e4147c"
          disabled={disabledApproveBtn}
          onClick={() => {}}
        />
      }
      {!hideBridgeBtn &&
        <PrimaryButton
          buttonText={bridgeBtnText}
          bgColor="#e4147c"
          disabled={disabledBridgeBtn}
          onClick={() => {}}
        />
      }
      <button onClick={() => setBtn(btn + 1)} className="text-fc">{btn}</button>
    </div>
  );
};

export default BridgeTokens;

/*
  1> Loading
    1> Background - post build-tx
  if(allowanceTarget === null) {
    1> Hide Approve Button
    2> Show Bridge Button - enabled
  } else {
    1> Check already approved amount
      if(allowance amount > already approved amount) {
        1> Show Approve Button
        2> Show Bridge Button - disabled
      } else {
        1> Hide Approve Button
        2> Show Bridge Button - enabled
      }
  }

  if(Approve enabled) {
    1> Click on Approve
      1> Call get approval tx data
      2> Wait for signature
      3> Send tx
      4> Show Loading Approving and disable the button
      5> Wait for tx to be confirmed
      6> Disable Approve and show Approved
  }
  1> Click on Bridge 
    1> Wait for signature
    2> Send tx
    3> Wait for tx to be confirmed
    4> Show Source tx
    5> Check for destination tx after every 20 sec
    6> Once got it, show destination tx
    7> Wait for it to be confirmed
    8> Bridging Completed, Thanks for using Socket
*/