import React, { useCallback, useContext, useEffect, useState } from "react";
import { ChainIdContext, RoutesContext, TokenDetailsContext } from "./WidgetWrapper";
import { TokenSelectDropdown } from "../Dropdown";
import DownArrowSvg from "../../assets/down-arrow.svg";
import { queryResponseObj } from "../../types";
import { useQuery } from "react-query";
import { getToTokenList, getQuote, getTokenPriceByTokenAddress } from "../../services";
import { isValidInput, updateTokenList } from "../../helpers";

import debounce from "lodash.debounce";
import { InputTokenAmountContext } from "./MainComponent";
let DEBOUNCE_TIMEOUT = 1500;

let price: any;
let outputTokenList: any;
let quoteList: queryResponseObj;

const OutputTokenSelect: React.FC = () => {
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails, outputTokenDetails, setOutputTokenDetails } = useContext(TokenDetailsContext);

  const [hideOutputTokenDropdown, setHideOutputTokenDropdown] = useState(true);
  const [fetchRoute, setFetchRoute] = useState(false);
  const { selectedRoute, setRoutes, setSelectedRoute } = useContext(RoutesContext);
  const { inputTokenAmount } = useContext(InputTokenAmountContext);

  const tokenPrice: queryResponseObj = useQuery(
    ["tokenPrice2", outputTokenDetails],
      () => getTokenPriceByTokenAddress(
        {
          tokenAddress: outputTokenDetails.address,
          chainId: outputChainId.toString()
        }
      ), {
      enabled: !!(outputTokenDetails.address)
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

  quoteList = useQuery(
    ["quoteList", inputTokenDetails.address, outputTokenDetails.address, inputTokenAmount],
      () => {
        console.log("calling");
        setFetchRoute(false);
        return getQuote(
          {
            fromChainId: inputChainId.toString(),
            fromTokenAddress: inputTokenDetails.address,
            toChainId: outputChainId.toString(),
            toTokenAddress: outputTokenDetails.address,
            fromAmount: (parseFloat(inputTokenAmount) * (10 ** inputTokenDetails.decimals)).toLocaleString().split(',').join(''),
            userAddress: "0x087f5052fbcd7c02dd45fb9907c57f1eccc2be25",
            uniqueRoutesPerBridge: true,
            sort: "output",
            singleTxOnly: true
          }
        )
      }, {
      enabled: !!(inputTokenDetails.address && outputTokenDetails.address && isValidInput.test(inputTokenAmount) && fetchRoute === true && inputTokenAmount != "")
    }
  );

  useEffect(() => {
    if (quoteList.isSuccess) {
      const response: any = quoteList.data?.data?.result;
      if (response?.routes.length) {
        setSelectedRoute(response?.routes[0]);
        setRoutes(response?.routes);
      } else {
        setSelectedRoute({});
        setRoutes([]);
      }
    }
  }, [quoteList.isSuccess, inputTokenDetails.address, outputTokenDetails.address, inputTokenAmount]);

  const debouncedFetchRouteCall = useCallback(
    debounce(() => {
      setFetchRoute(true);
    }, DEBOUNCE_TIMEOUT),
    [], // will be created only once initially
  );
  
  // debounce to reduce API calls while typing
  useEffect(() => {
    if (!isValidInput.test(inputTokenAmount) || inputTokenAmount == "") {
      return;
    }
    debouncedFetchRouteCall();
  }, [inputTokenAmount, inputTokenDetails.address, outputTokenDetails.address]);

  useEffect(() => {
    if (toTokenList.isSuccess) {
      outputTokenList = toTokenList.data?.data?.result;
      const { address, icon, symbol, decimals } = outputTokenList.filter((token: any) => (token.symbol === 'USDC'))[0];
      setOutputTokenDetails({ address, icon, symbol, decimals });
      outputTokenList = updateTokenList(outputChainId, outputTokenList);
    }
  }, [toTokenList.isSuccess, outputChainId]);

  if (tokenPrice.isSuccess) {
    price = tokenPrice.data?.data?.result.tokenPrice;
  } else if (tokenPrice.isError) {
    price = 0;
  }

  return (
    <div id="output-token-select" className="flex flex-col relative bg-bgLight rounded-lg px-3 py-2 border-2 border-bgLight">
      <div className="flex flex-row">
        <div className="text-bg3 text-xs mr-2">Receive</div>
        <div className="grow text-bg3 text-xs text-right font-medium">
          {price && Object.keys(selectedRoute).length !== 0 && inputTokenAmount != "" &&
            <>
              <input
                disabled
                className="text-xs font-medium bg-transparent w-full text-right border-none outline-none"
                value={`$ ${((price * parseInt(selectedRoute.toAmount)) / (10 ** outputTokenDetails.decimals)).toLocaleString()}`}
              />
            </>
          }
        </div>
      </div>
      <div className="flex flex-row">
        <div
          className="flex flex-row text-fc text-lg font-medium hover:cursor-pointer hover:text-blue-500"
          onClick={() => setHideOutputTokenDropdown(!hideOutputTokenDropdown)}
        >
          {(outputTokenDetails.address === "") &&
            <>
              {/* <img src={chainsByChainId[outputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" /> */}
              <div className="mr-2">Loading...</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" />
              </div>
            </>
          }
          {outputTokenDetails.address != "" && 
            <>
              <img src={outputTokenDetails.icon} className="w-4 h-4 rounded-full mr-1 self-center" />
              <div className="mr-2">{outputTokenDetails.symbol}</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" />
              </div>
            </>
          }
        </div>
        <div className="grow text-fc">
          <input
            placeholder="0"
            disabled
            value={
              quoteList.isLoading
                ? "Loading..."
                : (
                    Object.keys(selectedRoute).length === 0 || inputTokenAmount === "" || !isValidInput.test(inputTokenAmount)
                    ? "0"
                    : (parseInt(selectedRoute.toAmount) / (10 ** outputTokenDetails.decimals)).toString()
                  )
            }
            className="text-base font-medium bg-transparent w-full text-right border-none outline-none"
          />
        </div>
      </div>
      {!hideOutputTokenDropdown && outputTokenList &&
        <TokenSelectDropdown
          options={outputTokenList}
          chainId={outputChainId}
          setTokenDetail={(outputTokenDetail) => setOutputTokenDetails(outputTokenDetail)}
          onHide={(val) => setHideOutputTokenDropdown(val)}
        />
      }
    </div>
  )
};

export default OutputTokenSelect;