import React, { useContext, useState } from "react";
import { ChainDetail } from "../../types";
import { ChainSelectDropdown } from "../Dropdown";
import { ChainIdContext, TokenDetailsContext } from "../../contexts";
import DownArrowSvg from "../../assets/down-arrow.svg";
import LoadingSvg from "../../assets/loading.svg";

type Props = {
  chainsByChainId: any
  fromChainsList: Array<ChainDetail>
  swap: any
}

const InputChainSelect: React.FC<Props> = ({ chainsByChainId, fromChainsList, swap}) => {
  const { inputChainId, outputChainId, setInputChainId } = useContext(ChainIdContext);
  const { setInputTokenDetails } = useContext(TokenDetailsContext);

  const [hideInputChainDropdown, setHideInputChainDropdown] = useState(true);

  return (
    <div id="input-chain-select" className="hover:bg-pr col-start-1 col-span-5 text-fc bg-bgLight px-3 py-2 relative rounded-lg border-2 border-bgLight">
      <div className="flex flex-col">
        <div className="text-xs">From Network</div>
        <div
          className="flex flex-row justify-between hover:cursor-pointer"
          onClick={() => setHideInputChainDropdown(!hideInputChainDropdown)}
        >
          <div className="text-base font-medium">
            {chainsByChainId
              ?
              <div className="flex flex-row items-center">
                <img src={chainsByChainId[inputChainId].icon} className="w-4 h-4 rounded-md mr-1" />
                <div>{chainsByChainId[inputChainId].name}</div>
              </div>
              :
              <div>
                <LoadingSvg className="inline animate-spin -ml-1 mr-2 h-5 w-5 text-fc" /> Loading...
              </div>
            }
          </div>
          <div className="self-center">
            <DownArrowSvg className="rotate-90" style={{width: 6, height: 10}} />
          </div>
          {!hideInputChainDropdown && fromChainsList &&
            <ChainSelectDropdown
              options={fromChainsList}
              setChain={(chainId) => {
                if (chainId === inputChainId) return;
                setInputTokenDetails({ address: "", icon: "", symbol: "", decimals: 0 })
                if (chainId == outputChainId) swap();
                else setInputChainId(chainId)
              }}
              onHide={(val) => setHideInputChainDropdown(val)}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default InputChainSelect;