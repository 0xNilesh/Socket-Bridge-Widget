import React, { useContext, useState } from "react";
import { ChainDetail } from "../../types";
import { ChainSelectDropdown } from "../Dropdown";
import { ChainIdContext, TokenDetailsContext } from "./WidgetWrapper";
import DownArrowSvg from "../../assets/down-arrow.svg";

interface Props {
  chainsByChainId: any
  toChainsList: Array<ChainDetail>
  swap: any
}

const OutputChainSelect: React.FC<Props> = ({ chainsByChainId, toChainsList, swap}) => {
  const { inputChainId, outputChainId, setOutputChainId } = useContext(ChainIdContext);
  const { setOutputTokenDetails } = useContext(TokenDetailsContext);

  const [hideOutputChainDropdown, setHideOutputChainDropdown] = useState(true);

  return (
    <div id="output-chain-select" className="hover:bg-pr col-start-7 col-span-5 text-fc bg-bgLight px-3 py-2 relative rounded-lg border-2 border-bgLight">
      <div className="flex flex-col">
        <div className="text-xs">To Network</div>
        <div
          className="flex flex-row justify-between hover:cursor-pointer"
          onClick={() => setHideOutputChainDropdown(!hideOutputChainDropdown)}
        >
          <div className="text-base font-medium">
            {chainsByChainId &&
              <div className="flex flex-row items-center">
                <img src={chainsByChainId[outputChainId].icon} className="w-4 h-4 rounded-md mr-1" />
                <div>{chainsByChainId[outputChainId].name}</div>
              </div>
            }
          </div>
          <div className="self-center">
            <DownArrowSvg className="rotate-90" />
          </div>
          {!hideOutputChainDropdown && toChainsList &&
            <ChainSelectDropdown
              options={toChainsList}
              setChain={(chainId) => {
                setOutputTokenDetails({ address: "", icon: "", symbol: "", decimals: 0 })
                if (chainId == inputChainId) swap();
                else setOutputChainId(chainId)
              }}
              onHide={(val) => setHideOutputChainDropdown(val)}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default OutputChainSelect;