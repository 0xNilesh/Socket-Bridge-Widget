import React, { useContext, useState } from "react";
import { useQuery } from "react-query";
import { getFromTokenList, getSupportedChains, getTokenBalanceByTokenAddress, getTokenPriceByTokenAddress, getToTokenList } from "../../services";
import { ChainSelectDropdown, TokenSelectDropdown } from "../Dropdown";
import DownArrowSvg from "../../assets/down-arrow.svg";
import RightArrowSvg from "../../assets/right-arrow.svg";

import { ChainIdContext } from "./WidgetWrapper";
import { TokenDetailsContext } from "./WidgetWrapper";

interface Obj {
  [key: number | string]: Object;
}

export interface queryResponseObj {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
  error: Object | null,
  data: {
    data: {
      success: boolean,
      result: {
        [key: number | string]: any;
      }
    } | undefined
  } | undefined
};

const getChainDataByChainId = (chains: any) => {
  if (!chains.isSuccess) return [];

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
  const { inputTokenDetails, setInputTokenDetails, outputTokenDetails, setOutputTokenDetails } = useContext(TokenDetailsContext);
  const [hideInputChainDropdown, setHideInputChainDropdown] = useState(true);
  const [hideOutputChainDropdown, setHideOutputChainDropdown] = useState(true);
  const [hideInputTokenDropdown, setHideInputTokenDropdown] = useState(true);
  const [hideOutputTokenDropdown, setHideOutputTokenDropdown] = useState(true);
  const [inputTokenAmount, setInputTokenAmount] = useState("");
  // const [inputTokenBalance, setInputTokenBalance] = useState("0");
  
  // console.log(inputChainId, inputTokenAmount);
  let price;
  const tokenPrice: queryResponseObj = useQuery(
    ["tokenPrice", inputChainId, inputTokenDetails],
    () => getTokenPriceByTokenAddress(
      {
        tokenAddress: inputTokenDetails.address !== "" ? inputTokenDetails.address :chainsByChainId[inputChainId].currency.address,
        chainId: inputChainId.toString()
      }
    ), {
      enabled: !!chainsByChainId
    }
  );

  if (tokenPrice.isSuccess) {
    price = tokenPrice.data?.data?.result.tokenPrice;
  }

  // console.log(inputChainId);
  let inputTokenBalance = "0";
  const tokenBalance: queryResponseObj = useQuery(
    ["tokenBalance", inputChainId, inputTokenDetails],
    () => getTokenBalanceByTokenAddress(
      {
        tokenAddress: inputTokenDetails.address !== "" ? inputTokenDetails.address :chainsByChainId[inputChainId].currency.address,
        chainId: inputChainId.toString(),
        userAddress: '0x087f5052fbcd7c02dd45fb9907c57f1eccc2be25'
      }
    ), {
      enabled: !!chainsByChainId
    }
  );

  if (tokenBalance.isSuccess) {
    let balance = tokenBalance.data?.data?.result.balance;
    let decimals = tokenBalance.data?.data?.result.decimals;
    inputTokenBalance = (balance / (10 ** decimals)).toPrecision(3).toString();
  }

  let inputTokenList: any;
  const fromTokenList: queryResponseObj = useQuery(
    ["fromTokenList", inputChainId],
    () => getFromTokenList(
      {
        fromChainId: inputChainId.toString(),
        toChainId: outputChainId.toString(),
        isShortList: true
      }
    ), {
      enabled: !!(chainsByChainId != undefined && inputChainId)
    }
  );

  let outputTokenList: any;
  const toTokenList: queryResponseObj = useQuery(
    ["toTokenList", inputChainId],
    () => getToTokenList(
      {
        fromChainId: inputChainId.toString(),
        toChainId: outputChainId.toString(),
        isShortList: true
      }
    ), {
      enabled: !!(chainsByChainId != undefined && outputChainId)
    }
  );

  let userAddress = "0x087f5052fbcd7c02dd45fb9907c57f1eccc2be25";
  const updateTokenList = (chainId:number, tokenList:any) => {
    let customList: any = localStorage.getItem('customTokens');
    if (customList) {
      customList = JSON.parse(customList);
      if (customList[userAddress] && customList[userAddress][chainId]) {
        return [...customList[userAddress][chainId], ...tokenList];
      }
    }
    return tokenList;
  }

  if (fromTokenList.isSuccess) {
    inputTokenList = fromTokenList.data?.data?.result;
    inputTokenList = updateTokenList(inputChainId, inputTokenList);
  }

  if (toTokenList.isSuccess) {
    outputTokenList = toTokenList.data?.data?.result;
    outputTokenList = updateTokenList(outputChainId, outputTokenList);
  }

  // to check if inputTokenAmount is a valid amount
  let regexp = new RegExp(/^(\d*)?(\.)?\d*$/);

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
        <div id="chain-select" className="grid grid-cols-11 gap-4 rounded-xl">
          <div id="input-chain-select" className="hover:bg-pr col-start-1 col-span-5 text-fc bg-bgLight px-3 py-2 relative rounded-lg border-2 border-bgLight">
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
                      setInputTokenDetails({
                        address: chainsByChainId[chainId].currency.address,
                        symbol: chainsByChainId[chainId].currency.symbol,
                        icon: chainsByChainId[chainId].currency.icon
                      })
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
              onClick={() => {
                setInputTokenDetails({
                  address: chainsByChainId[outputChainId].currency.address,
                  symbol: chainsByChainId[outputChainId].currency.symbol,
                  icon: chainsByChainId[outputChainId].currency.icon
                })
                setOutputTokenDetails({
                  address: chainsByChainId[inputChainId].currency.address,
                  symbol: chainsByChainId[inputChainId].currency.symbol,
                  icon: chainsByChainId[inputChainId].currency.icon
                })
                swap();
              }}
            >
              <RightArrowSvg className="h-3 w-3" />
            </div>
          </div>
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
                      setOutputTokenDetails({
                        address: chainsByChainId[chainId].currency.address,
                        symbol: chainsByChainId[chainId].currency.symbol,
                        icon: chainsByChainId[chainId].currency.icon
                      })
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
        <div id="input-token-select" className="flex flex-col relative bg-bgLight rounded-lg px-3 py-2 border-2 border-bgLight hover:bg-pr focus-within:border-blue-500 focus-within:bg-pr">
          <div className="flex flex-row">
            <div className="text-bg3 text-xs mr-2">Send</div>
            <div className="grow text-bg3 text-xs text-right font-medium">
              {price && inputTokenAmount != "" && regexp.test(inputTokenAmount) &&
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
              onClick={() => setHideInputTokenDropdown(!hideInputTokenDropdown)}
            >
              {chainsByChainId && (inputTokenDetails.address === "") &&
                <>
                  <img src={chainsByChainId[inputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" />
                  <div className="mr-2">{chainsByChainId[inputChainId].currency.symbol}</div>
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
        <div className="mt-1">
          <div className="text-bg3 text-sm">
            {chainsByChainId && <>{inputTokenBalance} {inputTokenDetails.symbol !== "" ? inputTokenDetails.symbol : chainsByChainId[inputChainId].currency.symbol}</>}
          </div>
        </div>
        <div className="h-3"></div>
        <div id="output-token-select" className="flex flex-col relative bg-bgLight rounded-lg px-3 py-2 border-2 border-bgLight">
          <div className="flex flex-row">
            <div className="text-bg3 text-xs mr-2">Receive</div>
            <div className="grow text-bg3 text-xs text-right font-medium">
              {price && inputTokenAmount != "" && regexp.test(inputTokenAmount) &&
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
              onClick={() => setHideOutputTokenDropdown(!hideOutputTokenDropdown)}
            >
              {chainsByChainId && (outputTokenDetails.address === "") &&
                <>
                  <img src={chainsByChainId[outputChainId].currency.icon} className="w-4 h-4 rounded-full mr-1 self-center" />
                  <div className="mr-2">{chainsByChainId[outputChainId].currency.symbol}</div>
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
      </div>  
    </>
  );
};

export default MainComponent;