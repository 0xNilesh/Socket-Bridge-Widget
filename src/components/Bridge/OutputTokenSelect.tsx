import React, { useContext, useEffect, useState } from "react";
import { ChainIdContext, TokenDetailsContext } from "./WidgetWrapper";
import { TokenSelectDropdown } from "../Dropdown";
import DownArrowSvg from "../../assets/down-arrow.svg";
import { queryResponseObj } from "../../types";
import { useQuery } from "react-query";
import { getTokenPriceByTokenAddress, getToTokenList } from "../../services";
import { updateTokenList } from "../../helpers";

let outputTokenList: any;

const OutputTokenSelect: React.FC = () => {
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails, outputTokenDetails, setOutputTokenDetails} = useContext(TokenDetailsContext);

  const [hideOutputTokenDropdown, setHideOutputTokenDropdown] = useState(true);

  // const tokenPrice: queryResponseObj = useQuery(
  //   ["tokenPrice", inputChainId, inputTokenDetails],
  //     () => getTokenPriceByTokenAddress(
  //       {
  //         tokenAddress: inputTokenDetails.address,
  //         chainId: inputChainId.toString()
  //       }
  //     ), {
  //     enabled: !!(inputTokenDetails.address)
  //   }
  // );

  const toTokenList: queryResponseObj = useQuery(
    ["toTokenList", outputChainId],
      () => getToTokenList(
        {
          fromChainId: inputChainId.toString(),
          toChainId: outputChainId.toString(),
          isShortList: true
        }
      ), {
      enabled: !!(outputChainId)
    }
  );

  useEffect(() => {
    if (toTokenList.isSuccess) {
      outputTokenList = toTokenList.data?.data?.result;
      const { address, icon, symbol, decimals } = outputTokenList.filter((token: any) => (token.symbol === 'USDC'))[0];
      setOutputTokenDetails({ address, icon, symbol, decimals });
      outputTokenList = updateTokenList(outputChainId, outputTokenList);
    }
  }, [toTokenList.isSuccess, outputChainId]);

  return (
    <div id="output-token-select" className="flex flex-col relative bg-bgLight rounded-lg px-3 py-2 border-2 border-bgLight">
      <div className="flex flex-row">
        <div className="text-bg3 text-xs mr-2">Receive</div>
        <div className="grow text-bg3 text-xs text-right font-medium">
          {/* {price && inputTokenAmount != "" && regexp.test(inputTokenAmount) &&
            <>
              <input
                disabled
                className="text-xs font-medium bg-transparent w-full text-right border-none outline-none"
                value={`$ ${(price * parseFloat(inputTokenAmount)).toLocaleString()}`}
              />
            </>
          } */}
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
            // value={
            //   quoteList.isLoading
            //     ? "Loading..."
            //     : (
            //       Object.keys(selectedRoute).length == 0
            //       ? "0"
            //       : (parseInt(selectedRoute.toAmount) / (10 ** outputTokenDetails.decimals)).toString()
            //       )}
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