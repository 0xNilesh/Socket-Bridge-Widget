import React, { useContext, useState } from "react";
import { ChainIdContext, InputTokenAmountContext, TokenDetailsContext } from "../../contexts";
import { TokenSelectDropdown } from "../Dropdown";
import DownArrowSvg from "../../assets/down-arrow.svg";
import LoadingSvg from "../../assets/loading.svg";
import { queryResponseObj } from "../../types";
import { useQuery } from "react-query";
import { getTokenPriceByTokenAddress } from "../../services";
import { isValidInput } from "../../helpers";

let price: any;

const InputTokenSelect: React.FC = () => {
  const { inputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails, setInputTokenDetails } = useContext(TokenDetailsContext);

  const [hideInputTokenDropdown, setHideInputTokenDropdown] = useState(true);
  const { inputTokenAmount, setInputTokenAmount, inputTokenList } = useContext(InputTokenAmountContext);

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

  if (tokenPrice.isSuccess) {
    price = tokenPrice.data?.data?.result.tokenPrice;
  } else if (tokenPrice.isError) {
    price = 0;
  }

  return (
    <div id="input-token-select" className="flex flex-col relative bg-bgColorSecondary rounded-lg px-3 py-2 border-2 border-bgColorSecondary hover:bg-bgColorPrimary focus-within:border-blue-500 focus-within:bg-bgColorPrimary">
      <div className="flex flex-row">
        <div className="text-textColorSecondary text-xs mr-2">Send</div>
        <div className="grow text-textColorSecondary text-xs text-right font-medium">
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
          className="flex flex-row text-textColorPrimary text-lg font-medium hover:cursor-pointer hover:text-blue-500"
            onClick={() => setHideInputTokenDropdown(!hideInputTokenDropdown)
          }
        >
          {(inputTokenDetails.address === "") &&
            <>
              {/* <img src={chainsByChainId[inputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" /> */}
              <div className="mr-2"><LoadingSvg className="inline animate-spin -ml-1 mr-2 h-5 w-5 text-textColorPrimary" /> Loading...</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" style={{width: 6, height: 10}} />
              </div>
            </>
          }
          {inputTokenDetails.address != "" && 
            <>
              <img src={inputTokenDetails.icon} className="w-4 h-4 rounded-full mr-1 self-center" />
              <div className="mr-2">{inputTokenDetails.symbol}</div>
              <div className="self-center">
                <DownArrowSvg className="rotate-90 mr-1" style={{width: 6, height: 10}} />
              </div>
            </>
          }
        </div>
        <div className="grow text-textColorPrimary">
          <input
            placeholder="0"
            className="text-base font-medium bg-transparent w-full text-right border-none outline-none"
            onChange={(e) => setInputTokenAmount(e.target.value)}
            value={inputTokenAmount}
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