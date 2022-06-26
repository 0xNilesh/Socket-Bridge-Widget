import React, { useCallback, useContext, useEffect, useState } from "react";
import { ChainIdContext, InputTokenAmountContext, RouteLoadingContext, RoutesContext, SortTypeContext, TokenDetailsContext, useWeb3Context, WarningMsgContext } from "../../contexts";
import { TokenSelectDropdown } from "../Dropdown";
import LoadingSvg from "../../assets/loading.svg";
import DownArrowSvg from "../../assets/down-arrow.svg";
import { queryResponseObj } from "../../types";
import { useQuery } from "react-query";
import { getQuote, getTokenPriceByTokenAddress } from "../../services";
import { isValidInput } from "../../helpers";

import debounce from "lodash.debounce";
import { useIsMount } from "../../hooks";
let DEBOUNCE_TIMEOUT = 1000;

let price: any;
let quoteList: queryResponseObj;

const OutputTokenSelect: React.FC = () => {
  const { account } = useContext(useWeb3Context);
  const { setRouteLoading } = useContext(RouteLoadingContext);
  const { setWarningMsg } = useContext(WarningMsgContext);
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails, outputTokenDetails, setOutputTokenDetails } = useContext(TokenDetailsContext);

  const [hideOutputTokenDropdown, setHideOutputTokenDropdown] = useState(true);
  const [fetchRoute, setFetchRoute] = useState(false);
  const { selectedRoute, setRoutes, setSelectedRoute } = useContext(RoutesContext);
  const { inputTokenAmount, outputTokenList } = useContext(InputTokenAmountContext);
  const { sortType } = useContext(SortTypeContext);
  
  const isMount = useIsMount();

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

  quoteList = useQuery(
    ["quoteList", inputTokenDetails.address, outputTokenDetails.address, inputTokenAmount, sortType],
      () => {
        setFetchRoute(false);
        return getQuote(
          {
            fromChainId: inputChainId.toString(),
            fromTokenAddress: inputTokenDetails.address,
            toChainId: outputChainId.toString(),
            toTokenAddress: outputTokenDetails.address,
            fromAmount: (parseFloat(inputTokenAmount) * (10 ** inputTokenDetails.decimals)).toLocaleString().split(',').join(''),
            userAddress: account,
            uniqueRoutesPerBridge: true,
            sort: sortType,
            singleTxOnly: true
          }
        )
      }, {
        enabled: !!(account && account != "" && inputTokenDetails.address && outputTokenDetails.address && isValidInput.test(inputTokenAmount) && fetchRoute === true && inputTokenAmount != ""),
        cacheTime: 0
    }
  );

  useEffect(() => {
    if (isMount) return;
    if (quoteList.isLoading) {
      setRouteLoading(true);
    }
    if (quoteList.isSuccess) {
      const response: any = quoteList.data?.data?.result;
      if (response?.routes.length) {
        if (sortType === "output") setSelectedRoute(response?.routes[0]);
        else setSelectedRoute(response?.routes[response?.routes.length-1]);
        setRoutes(response?.routes);
      } else {
        setWarningMsg('No bridges support this trade. Try bigger amount.');
        setSelectedRoute({});
        setRoutes([]);
        setInterval(() => {
          setWarningMsg('');
        }, 5000);
      }
      setRouteLoading(false);
    }
  }, [quoteList.isLoading, inputTokenDetails.address, outputTokenDetails.address, inputTokenAmount, sortType]);

  const debouncedFetchRouteCall = useCallback(
    debounce(() => {
      setFetchRoute(true);
    }, DEBOUNCE_TIMEOUT),
    [], // will be created only once initially
  );
  
  // debounce to reduce API calls while typing
  useEffect(() => {
    if (isMount) return;
    if (!isValidInput.test(inputTokenAmount) || inputTokenAmount == "") {
      return;
    }
    debouncedFetchRouteCall();
  }, [inputTokenAmount, inputTokenDetails.address, outputTokenDetails.address, sortType]);

  if (tokenPrice.isSuccess) {
    price = tokenPrice.data?.data?.result.tokenPrice;
  } else if (tokenPrice.isError) {
    price = 0;
  }

  return (
    <div id="output-token-select" className="flex flex-col relative bg-bgColorSecondary rounded-lg px-3 py-2 border-2 border-bgColorSecondary">
      <div className="flex flex-row">
        <div className="text-textColorSecondary text-xs mr-2">Receive</div>
        <div className="grow text-textColorSecondary text-xs text-right font-medium">
          {price && Object.keys(selectedRoute).length !== 0 && inputTokenAmount != "" && !quoteList.isLoading &&
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
          className="flex flex-row text-textColorPrimary text-lg font-medium hover:cursor-pointer hover:text-blue-500"
          onClick={() => setHideOutputTokenDropdown(!hideOutputTokenDropdown)}
        >
          {(outputTokenDetails.address === "") &&
            <>
              {/* <img src={chainsByChainId[outputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" /> */}
              <div className="mr-2"><LoadingSvg className="inline animate-spin -ml-1 mr-2 h-5 w-5 text-textColorPrimary" /> Loading...</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" style={{width: 6, height: 10}} />
              </div>
            </>
          }
          {outputTokenDetails.address != "" && 
            <>
              <img src={outputTokenDetails.icon} className="w-4 h-4 rounded-full mr-1 self-center" />
              <div className="mr-2">{outputTokenDetails.symbol}</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" style={{width: 6, height: 10}} />
              </div>
            </>
          }
        </div>
        <div className="grow text-textColorPrimary">
          <input
            placeholder="0"
            disabled
            value={
              quoteList.isLoading
                ? 'Loading...'
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