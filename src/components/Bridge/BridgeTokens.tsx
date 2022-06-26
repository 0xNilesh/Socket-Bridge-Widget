import { result } from "lodash";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery } from "react-query";
import DownArrowSvg from "../../assets/down-arrow.svg";
import LoadingSvg from "../../assets/loading.svg";
import GreenTickSvg from "../../assets/green-tick.svg";
import { BridgesContext, ChainIdContext, ChainsContext, RoutesContext, TabIndexContext, TokenDetailsContext, useWeb3Context, WidgetWidthContext } from "../../contexts";
import { getAllowanceDetail, getApprovalTxData, getBridgeStatus, getRouteTransactionData } from "../../services";

import { queryResponseObj } from "../../types";
import { PrimaryButton } from "../Button";
let allowanceAmount: queryResponseObj;
let bridgeStatus: queryResponseObj;

const BridgeTokens = () => {
  const { account, w3Provider, signer } = useContext(useWeb3Context);
  const { widgetWidth } = useContext(WidgetWidthContext);
  const { setTabIndex } = useContext(TabIndexContext);
  const { selectedRoute } = useContext(RoutesContext);
  const { bridgesByName } = useContext(BridgesContext);
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { chainsByChainId } = useContext(ChainsContext);
  const { inputTokenDetails, outputTokenDetails } = useContext(TokenDetailsContext);
  const [loading, setLoading] = useState(true);
  const [allowanceTarget, setAllowanceTarget] = useState(null);
  const [apiTxData, setApiTxData] = useState({} as any);
  const [minimumApprovalAmount, setMinimumApprovalAmount] = useState(null);
  const [approveBtnText, setApproveBtnText] = useState("Approve");
  const [bridgeBtnText, setBridgeBtnText] = useState("Bridge");
  const [hideApproveBtn, setHideApproveBtn] = useState(true);
  const [hideBridgeBtn, setHideBridgeBtn] = useState(true);
  const [loadingApproveBtn, setLoadingApproveBtn] = useState(false);
  const [loadingBridgeBtn, setLoadingBridgeBtn] = useState(false);
  const [disabledApproveBtn, setDisabledApproveBtn] = useState(false);
  const [disabledBridgeBtn, setDisabledBridgeBtn] = useState(false);
  const [warning, setWarning] = useState('');
  const [sourceTxHash, setSourceTxHash] = useState(null);
  const [destinationTxHash, setDestinationTxHash] = useState(null);

  const isFirstMount = useRef(true);

  const inputAmountSimplified = (parseFloat(selectedRoute.fromAmount) / (10 ** inputTokenDetails.decimals)).toFixed(4).toString() + " " + inputTokenDetails.symbol;
  const outputAmountSimplified = (parseFloat(selectedRoute.toAmount) / (10 ** outputTokenDetails.decimals)).toFixed(4).toString() + " " + outputTokenDetails.symbol;
  const bridgeName = bridgesByName[selectedRoute.usedBridgeNames[0]].displayName;

  allowanceAmount = useQuery(["checkAllowance"],
    () => getAllowanceDetail({
      chainId: inputChainId.toString(),
      owner: account,
      allowanceTarget: allowanceTarget,
      tokenAddress: inputTokenDetails.address
    }), {
      enabled: !!(allowanceTarget !== null && sourceTxHash === null)
    }
  );

  bridgeStatus = useQuery(["bridgeStatus", sourceTxHash],
    () => getBridgeStatus({
      transactionHash: sourceTxHash,
      fromChainId: inputChainId.toString(),
      toChainId: outputChainId.toString()
    }), {
      enabled: !!(sourceTxHash !== null && destinationTxHash == null),
      refetchInterval: 20000
    }
  );

  const routeTxData = useMutation(["routeTxData"],
      getRouteTransactionData, {
        onSuccess: (data: any) => {
          setLoading(false);
          setApiTxData(data.data?.result);
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
    if (bridgeStatus.isSuccess) {
      const response: any = bridgeStatus.data?.data?.result;
      console.log(response);
      if (response.destinationTransactionHash != null && response.destinationTxStatus == "COMPLETED") {
        setDestinationTxHash(response.destinationTransactionHash);
      }
    }
  }, [bridgeStatus.isSuccess, destinationTxHash]);

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

  const gasLimitFromRoute = () => {
    if (Object.keys(selectedRoute).length === 0) return;
    let userBridgeTx = {} as any;
    selectedRoute.userTxs.map((userTx: any) => {
      if (userTx.userTxType === "fund-movr") {
        userBridgeTx = userTx;
      }
    });

    let gasLimit = userBridgeTx.gasFees.gasLimit;
    return gasLimit;
  }

  const handleApprove = async () => {
    if (!minimumApprovalAmount) return;

    try {
      setDisabledApproveBtn(true);
      setLoadingApproveBtn(true);
      setApproveBtnText('Approving...');

      const approvalTransactionData: any = await getApprovalTxData({
        chainId: inputChainId.toString(),
        owner: account,
        allowanceTarget: allowanceTarget,
        tokenAddress: inputTokenDetails.address,
        amount: minimumApprovalAmount
      });
      console.log(approvalTransactionData);
      console.log(signer);

      const gasPrice = await signer.getGasPrice();
      console.log(gasPrice);

      console.log({
        from: signer._address,
        to: approvalTransactionData.data?.result?.to,
        value: '0x00',
        data: approvalTransactionData.data?.result?.data,
        gasPrice: gasPrice
      });

      const gasEstimate = await w3Provider.estimateGas({
          from: signer._address,
          to: approvalTransactionData.data?.result?.to,
          value: '0x00',
          data: approvalTransactionData.data?.result?.data,
          gasPrice: gasPrice
      });

      console.log(gasEstimate);

      const tx = await signer.sendTransaction({
          from: approvalTransactionData.data?.result?.from,
          to: approvalTransactionData.data?.result?.to,
          value: '0x00',
          data: approvalTransactionData.data?.result?.data,
          gasPrice: gasPrice,
          gasLimit: gasEstimate
      });
      console.log(tx);

      // Initiates approval transaction on user's frontend which user has to sign
      const receipt = await tx.wait();

      console.log('Approval Transaction Hash :', receipt.transactionHash);

      setLoadingApproveBtn(false);
      setApproveBtnText('Approved');
      setInterval(() => {
        setHideApproveBtn(true);
      }, 3000);
      setDisabledBridgeBtn(false);
    } catch (err: any) {
      console.error(err);
      setWarning(err.message);
      setInterval(() => {
        setWarning('');
      }, 3000);
      setDisabledApproveBtn(false);
      setLoadingApproveBtn(false);
      setApproveBtnText('Approve');
    }
  }

  const handleBridge = async () => {
    try {
      setDisabledBridgeBtn(true);
      setLoadingBridgeBtn(true);
      setBridgeBtnText('Bridging...');
      
      const gasPrice = await signer.getGasPrice();

      // const gasEstimate = await w3Provider.estimateGas({
      //   from: signer._address,
      //   to: apiTxData.txTarget,
      //   value: apiTxData.value,
      //   data: apiTxData.txData,
      //   gasPrice: gasPrice
      // });

      const gasEstimate = gasLimitFromRoute() + 1000;
      console.log(gasEstimate);

      const tx = await signer.sendTransaction({
          from: signer._address,
          to: apiTxData.txTarget,
          data: apiTxData.txData,
          value: apiTxData.value,
          gasPrice: gasPrice,
          gasLimit: gasEstimate
      });

      // Initiates swap/bridge transaction on user's frontend which user has to sign
      const receipt = await tx.wait();

      const txHash = receipt.transactionHash;

      console.log('Bridging Transaction : ', receipt.transactionHash);

      setLoadingBridgeBtn(false);
      setBridgeBtnText('Bridged');
      setInterval(() => {
        setHideBridgeBtn(true);
        setSourceTxHash(txHash);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      setWarning(err.message);
      setInterval(() => {
        setWarning('');
      }, 3000);
      setDisabledBridgeBtn(false);
      setLoadingBridgeBtn(false);
      setBridgeBtnText('Bridge');
    }
  }

  return (
    <div>
      <div className="flex flex-row" id="bridge-header">
        <button
          className="w-6 h-6 rounded-md hover:bg-bgColorSecondary hover:cursor-pointer mr-2 text-textColorPrimary flex justify-center items-center"
          onClick={() => setTabIndex(0)}
        >
          <DownArrowSvg className="rotate-180" style={{ width: 9, height: 14 }} />
        </button>
        <div className="grow text-center text-xl text-textColorPrimary font-medium">
          Bridge
        </div>
      </div>
      <div className="h-3"></div>
      <div className="h-4"></div>
      <div className="text-textColorPrimary text-base font-medium">Bridge Info</div>
      <div className="text-textColorSecondary test-xs font-normal py-1">{inputAmountSimplified} on {chainsByChainId[inputChainId]["name"]} to {outputAmountSimplified} on {chainsByChainId[outputChainId]["name"]} via {bridgeName} bridge</div>
      {loading && <div className="text-textColorPrimary text-base font-medium mt-4 mb-4 py-5 text-center"><LoadingSvg className="inline animate-spin -ml-1 mr-2 h-20 w-20 text-textColorPrimary" /></div>}
      {(sourceTxHash !== null && destinationTxHash === null) &&
        <div className="text-textColorPrimary text-base font-medium mt-4 mb-4 py-5 text-center">
          <LoadingSvg className="inline animate-spin -ml-1 mr-2 h-20 w-20 text-textColorPrimary" />
          <div className="text-textColorPrimary text-base font-medium pt-4">Bridging in Progress...</div>
        </div>
      }
      {destinationTxHash !== null &&
        <div className="py-5 flex flex-col items-center">
          <GreenTickSvg className="h-20 w-20" />
          <div className="text-textColorPrimary text-base font-medium pt-2">Transaction completed</div>
        </div>
      }
      {warning && <div className="mt-4 mb-4 text-base font-medium text-red-500">{warning}</div>}
      <div className={`flex ${widgetWidth > 400 ? 'flex-row' : 'flex-col'} gap-4 mt-3`}>
        {!hideApproveBtn &&
          <PrimaryButton
            buttonText={approveBtnText}
            loading={loadingApproveBtn}
            bgColor={getComputedStyle(document.documentElement)
    .getPropertyValue('--btnColorPrimary')}
            disabled={disabledApproveBtn}
            onClick={handleApprove}
          />
        }
        {!hideBridgeBtn &&
          <PrimaryButton
            buttonText={bridgeBtnText}
            loading={loadingBridgeBtn}
            bgColor={getComputedStyle(document.documentElement)
    .getPropertyValue('--btnColorPrimary')}
            disabled={disabledBridgeBtn}
            onClick={handleBridge}
          />
        }
      </div>
      {sourceTxHash !== null && chainsByChainId &&
        <div className="flex flex-row justify-around mt-3">
          <button
            className="text-xs text-blue-500 hover:underline border rounded-3xl border-textColorSecondary bg-bgColorDropdown px-2.5 py-1.5 flex flex-row"
          >
            <img src={chainsByChainId[inputChainId].icon} className="w-4 h-4 rounded-full mr-1" />
            <a href={`${chainsByChainId[inputChainId].explorers[0]}/tx/${sourceTxHash}`} target="_blank">Source Tx</a>
          </button>
          <button
            className="text-xs text-blue-500 hover:underline border disabled:pointer-events-none bg-bgColorDropdown disabled:opacity-50 rounded-3xl border-textColorSecondary px-2.5 py-1.5 flex flex-row"
            disabled={destinationTxHash === null}
          >
            <img src={chainsByChainId[outputChainId].icon} className="w-4 h-4 rounded-full mr-1" />
            <a href={`${chainsByChainId[outputChainId].explorers[0]}/tx/${destinationTxHash}`} target="_blank">Destination Tx</a>
          </button>
        </div>
      }
    </div>
  );
};

export default BridgeTokens;