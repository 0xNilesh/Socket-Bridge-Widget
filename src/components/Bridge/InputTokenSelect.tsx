import React, { useContext, useEffect, useState } from "react";
import { ChainIdContext, TokenDetailsContext } from "./WidgetWrapper";
import { TokenSelectDropdown } from "../Dropdown";
import DownArrowSvg from "../../assets/down-arrow.svg";
import { queryResponseObj } from "../../types";
import { useQuery } from "react-query";
import { getFromTokenList, getTokenPriceByTokenAddress } from "../../services";
import { isValidInput, updateTokenList } from "../../helpers";
import { InputTokenAmountContext } from "./MainComponent";

let price: any;
let inputTokenList: any;

const InputTokenSelect: React.FC = () => {
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails, setInputTokenDetails } = useContext(TokenDetailsContext);

  const [hideInputTokenDropdown, setHideInputTokenDropdown] = useState(true);
  const { inputTokenAmount, setInputTokenAmount } = useContext(InputTokenAmountContext);

  const tokenPrice: queryResponseObj = useQuery(
    ["tokenPrice1", inputTokenDetails],
    () => getTokenPriceByTokenAddress(
      {
        tokenAddress: inputTokenDetails.address,
        chainId: inputChainId.toString()
      }
    ), {
    enabled: !!(inputTokenDetails.address != "")
  }
  );

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

  useEffect(() => {
    if (fromTokenList.isSuccess) {
      inputTokenList = fromTokenList.data?.data?.result;
      const { address, icon, symbol, decimals } = inputTokenList.filter((token: any) => (token.symbol === 'USDC'))[0];
      console.log(address, icon, symbol);
      setInputTokenDetails({ address, icon, symbol, decimals });
      inputTokenList = updateTokenList(inputChainId, inputTokenList);
    }
  }, [fromTokenList.isSuccess, inputChainId]);

  if (tokenPrice.isSuccess) {
    price = tokenPrice.data?.data?.result.tokenPrice;
  } else if (tokenPrice.isError) {
    price = 0;
  }

  return (
    <div id="input-token-select" className="flex flex-col relative bg-bgLight rounded-lg px-3 py-2 border-2 border-bgLight hover:bg-pr focus-within:border-blue-500 focus-within:bg-pr">
      <div className="flex flex-row">
        <div className="text-bg3 text-xs mr-2">Send</div>
        <div className="grow text-bg3 text-xs text-right font-medium">
          {price && inputTokenAmount != "" && isValidInput.test(inputTokenAmount) &&
            <>
              <input
                disabled
                className="text-xs font-medium bg-transparent w-full text-right border-none outline-none"
                value={`$ ${(price * parseFloat(inputTokenAmount)).toLocaleString()}`}
              />
            </>
          }
        </div>
      </div>
      <div className="flex flex-row">
        <div
          className="flex flex-row text-fc text-lg font-medium hover:cursor-pointer hover:text-blue-500"
            onClick={() => setHideInputTokenDropdown(!hideInputTokenDropdown)
          }
        >
          {(inputTokenDetails.address === "") &&
            <>
              {/* <img src={chainsByChainId[inputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" /> */}
              <div className="mr-2">Loading...</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" />
              </div>
            </>
          }
          {inputTokenDetails.address != "" && 
            <>
              <img src={inputTokenDetails.icon} className="w-4 h-4 rounded-full mr-1 self-center" />
              <div className="mr-2">{inputTokenDetails.symbol}</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" />
              </div>
            </>
          }
        </div>
        <div className="grow text-fc">
          <input
            placeholder="0"
            className="text-base font-medium bg-transparent w-full text-right border-none outline-none"
            onChange={(e) => setInputTokenAmount(e.target.value)}
          />
        </div>
      </div>
      {!hideInputTokenDropdown && inputTokenList &&
        <TokenSelectDropdown
          options={inputTokenList}
          chainId={inputChainId}
          setTokenDetail={(inputTokenDetail) => setInputTokenDetails(inputTokenDetail)}
          onHide={(val) => setHideInputTokenDropdown(val)}
        />
      }
    </div>
  )
};

export default InputTokenSelect;