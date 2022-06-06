import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { getSupportedChains } from "../../services";
import { ChainSelectDropdown } from "../Dropdown";
import DownArrowSvg from "../../assets/down-arrow.svg";
import RightArrowSvg from "../../assets/right-arrow.svg";

import { ChainIdContext } from "./WidgetWrapper";

interface Obj {
  [key: number | string]: Object;
}

const getChainDataByChainId = (chains: any) => {
  if (chains.isLoading) return [];

  const data = chains.data?.data?.result;
  const chainsByChainId: Obj = {};
  const fromChainsList: Array<Obj> = [];
  const toChainsList: Array<Obj> = [];

	data.forEach((chain:any) => {
		chainsByChainId[chain.chainId] = chain;
    if (chain.sendingEnabled) {
      fromChainsList.push({
        chainId: chain.chainId,
        name: chain.name,
        icon: chain.icon
      });
    }
    if (chain.receivingEnabled) {
      toChainsList.push({
        chainId: chain.chainId,
        name: chain.name,
        icon: chain.icon
      });
    }
	});
  return [chainsByChainId, fromChainsList, toChainsList, data];
};

const MainComponent = () => {
  const chainsResponse = useQuery(["chains"], getSupportedChains);
  const [chainsByChainId, fromChainsList, toChainsList, chainsArr] = getChainDataByChainId(chainsResponse);
  // console.log(chainsByChainId, fromChainsList, toChainsList, chainsArr);
  const { inputChainId, outputChainId, setInputChainId, setOutputChainId } = useContext(ChainIdContext);
  const [hideInputChainDropdown, setHideInputChainDropdown] = useState(true);
  const [hideOutputChainDropdown, setHideOutputChainDropdown] = useState(true);
  // console.log(inputChainId, outputChainId);

  const swap = () => {
    if (
			chainsByChainId[inputChainId].receivingEnabled === true &&
			chainsByChainId[outputChainId].sendingEnabled === true
		) {
			const fromChain = inputChainId, toChain = outputChainId;
			setInputChainId(toChain);
			setOutputChainId(fromChain);
		}
	};

  return (
    <>
      <div className="flex flex-col">
        <div className="grid grid-cols-11 gap-4 rounded-xl" id="chain-select">
          <div className="hover:bg-pr col-start-1 col-span-5 text-fc bg-bgLight px-3 py-2 relative rounded-lg border-2 border-bgLight active:border-blue-500">
            <div className="flex flex-col">
              <div className="text-xs">From Network</div>
              <div
                className="flex flex-row justify-between hover:cursor-pointer"
                onClick={() => setHideInputChainDropdown(!hideInputChainDropdown)}
              >
                <div className="text-base font-medium">
                  {chainsByChainId &&
                    <div className="flex flex-row items-center">
                      <img src={chainsByChainId[inputChainId].icon} className="w-4 h-4 rounded-md mr-1" />
                      <div>{chainsByChainId[inputChainId].name}</div>
                    </div>
                  }
                </div>
                <div className="self-center">
                  <DownArrowSvg className="rotate-90" />
                </div>
                {!hideInputChainDropdown && fromChainsList &&
                  <ChainSelectDropdown
                    options={fromChainsList}
                    setChain={(chainId) => {
                      if (chainId == outputChainId) swap();
                      else setInputChainId(chainId)
                    }}
                    onHide={(val) => setHideInputChainDropdown(val)}
                  />
                }
              </div>
            </div>
          </div>
          <div className="self-center text-fc">
            <div
              className="flex justify-center items-center rounded-lg border-2 border-bgLight bg-pr h-7 hover:cursor-pointer hover:bg-bgLight"
              onClick={swap}
            >
              <RightArrowSvg className="h-3 w-3" />
            </div>
          </div>
          <div className="hover:bg-pr col-start-7 col-span-5 text-fc bg-bgLight px-3 py-2 relative rounded-lg border-2 border-bgLight active:border-blue-500">
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
                      if (chainId == inputChainId) swap();
                      else setOutputChainId(chainId)
                    }}
                    onHide={(val) => setHideOutputChainDropdown(val)}
                  />
                }
              </div>
            </div>
          </div>
        </div>
        <div className="h-3"></div>
        <div className="flex flex-col bg-bgLight rounded-lg px-3 py-2 border-2 border-bgLight hover:bg-pr active:border-blue-500">
          <div className="flex flex-row">
            <div className="text-bg3 text-xs">Send</div>
            <div className="grow text-bg3 text-xs text-right font-medium">
              $ 1,878.93
            </div>
          </div>
          <div className="flex flex-row">
            <div className="flex flex-row text-fc text-lg font-medium hover:cursor-pointer hover:text-blue-500">
              {chainsByChainId &&
                <>
                  <img src={chainsByChainId[inputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" />
                  <div className="mr-2">{chainsByChainId[inputChainId].currency.symbol}</div>
                  <div className="self-center">
                    <DownArrowSvg className="rotate-90" />
                  </div>
                </>
              }
            </div>
            <div className="grow text-fc">
              <input placeholder="0" className="text-base font-medium bg-transparent w-full text-right border-none outline-none" />
            </div>
          </div>
        </div>
      </div>  
    </>
  );
};

export default MainComponent;