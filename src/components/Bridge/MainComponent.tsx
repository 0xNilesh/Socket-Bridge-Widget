import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { getSupportedChains } from "../../services";
import { ChainSelectDropdown } from "../Dropdown";

import { ChainIdContext } from "./WidgetWrapper";

interface obj {
  [key: number | string]: Object;
}

const getChainDataByChainId = (chains: any) => {
  if (chains.isLoading) return [];

  const data = chains.data?.data?.result;
  const chainsByChainId: obj = {};
  const fromChainsList: Array<obj> = [];
  const toChainsList: Array<obj> = [];

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

  return (
    <>
      <div className="grid grid-cols-11 gap-4 rounded-xl">
        <div className="hover:bg-pr col-start-1 col-span-5 bg-pr text-fc bg-bgLight px-3 py-2 relative rounded-lg border-2 border-bgLight">
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
              <div>DA</div>
              {!hideInputChainDropdown && fromChainsList &&
                <ChainSelectDropdown
                  options={fromChainsList}
                  setChain={(id) => setInputChainId(id)}
                  onHide={(val) => setHideInputChainDropdown(val)}
                />
              }
            </div>
          </div>
        </div>
        <div className="bg-bgLight text-fc rounded-lg">02</div>
        <div className="hover:bg-pr col-start-7 col-span-5 bg-pr text-fc bg-bgLight px-3 py-2 relative rounded-lg border-2 border-bgLight">
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
              <div>DA</div>
              {!hideOutputChainDropdown && toChainsList &&
                <ChainSelectDropdown
                  options={toChainsList}
                  setChain={(id) => setOutputChainId(id)}
                  onHide={(val) => setHideOutputChainDropdown(val)}
                />
              }
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainComponent;