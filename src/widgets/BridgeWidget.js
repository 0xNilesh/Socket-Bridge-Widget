import { setUserAddress} from "../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import React, { useState } from "react";
import { ReactComponent as RightArrowSvg } from "../assets/right-arrow.svg";
import { ReactComponent as DownArrowSvg } from "../assets/down-arrow.svg";
import "./BridgeWidget.css";

import { useGetSupportedChainsQuery } from "../services/socket";

const getChainDataByChainId = (chains) => {
  if (!chains) return [];
  const chainsByChainId = {}, chainsByNameToId = {};
  chains.forEach((chain) => {
    chainsByChainId[chain.chainId] = chain;
    chainsByNameToId[chain.name] = chain.chainId;
  });
  return [ chainsByChainId, chainsByNameToId, chains];
}

const BridgeWidget = ({ address, provider }) => {
  const dispatch = useDispatch();
  const chains = useGetSupportedChainsQuery();
  const [chainsByChainId, chainsByNameToId, chainsByChainIdArr] = getChainDataByChainId(chains.data?.result);
  console.log(chainsByChainId);
  console.log(chainsByNameToId);
  console.log(chainsByChainIdArr);

  const [fromChain, setFromChain] = useState(1);
  const [toChain, setToChain] = useState(137);
  const [bridgeSortTypeRadio, setBridgeSortTypeRadio] = useState('amount');

  // React.useEffect(() => {
  //   if (!address) return;
  //   dispatch(setUserAddress(address));
  // })

  const swapChains = (e) => {
    e.preventDefault();
    if (!chainsByChainId) return;
    if (chainsByChainId[fromChain].receivingEnabled === true &&
      chainsByChainId[toChain].sendingEnabled === true) {
      const from = fromChain, to = toChain;
      setFromChain(to);
      setToChain(from);
    }
  }

  const cont = document.getElementById("socket-bridge-widget-container");
  if (cont) {
    console.log(cont.clientWidth - 48);
  }

  const switchBridgeSortType = () => {
    setBridgeSortTypeRadio(bridgeSortTypeRadio === 'amount' ? 'time' : 'amount');
  }

  return (
    <>
      <div className="sbw-container sbw-outer-box" id="socket-bridge-widget-container">
        <form>
          <div className="sbw-inner-box">
            <div className="sbw-switch-bridge-type">
              <label>
                <div className="sbw-box-1">Max Received</div>
                <input
                  type="radio"
                  value="amount"
                  name="bridgeSortType"
                  checked={bridgeSortTypeRadio === 'amount'}
                  onChange={() => switchBridgeSortType()}
                />
                <div className="sbw-hidden-box"></div>
              </label>
              <label>
                <div className="sbw-box-1">Fastest Transfer</div>
                <input
                  type="radio"
                  value="time"
                  name="bridgeSortType"
                  checked={bridgeSortTypeRadio === 'time'}
                  onChange={() => switchBridgeSortType()}
                />
                <div className="sbw-hidden-box"></div>
              </label>
            </div>
            <div></div>
            <div className="sbw-chains-select-box sbw-grid-col-1">
              <fieldset className="sbw-fieldset">
                <div className="sbw-grid-col-box">
                  <label>From Network</label>
                  <div className="sbw-grid-row-box sbw-grid-col-2">
                    <div className="sbw-icon-size-1">
                      {chainsByChainId != undefined && <img src={chainsByChainId[fromChain].icon} className="sbw-icon-img-1" />}
                    </div>
                    <div className="sbw-width-100">
                      <div className="sbw-text-1">
                        <div className="sbw-box-2 sbw-outline-none">
                          <select
                            id="inputChainId"
                            name="inputChainId"
                            className="sbw-chain-select sbw-outline-none"
                            onChange={(el) => {setFromChain(el.target.value)}}
                          >
                            {chainsByChainIdArr != undefined && chainsByChainIdArr.map(chain => {
                              if (chain.sendingEnabled !== true) return;
                              return (
                                <option
                                  key={chain.chainId}
                                  className="sbw-option"
                                  value={chain.chainId}
                                  selected={chain.chainId == fromChain}
                                >
                                  {chain.name}
                                </option>
                              )
                            })}
                          </select>
                          <div className="sbw-down-arrow-box">
                            <DownArrowSvg style={{transform: 'rotate(90deg)'}}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <button className="sbw-arrow-button" onClick={(e) => swapChains(e)}>
                <div className="sbw-icon-box-1">
                  <RightArrowSvg />
                </div>
              </button>
              <fieldset className="sbw-fieldset">
                <div className="sbw-grid-col-box">
                  <label>To Network</label>
                  <div className="sbw-grid-row-box sbw-grid-col-2">
                    <div className="sbw-icon-size-1">
                      {chainsByChainId != undefined && <img src={chainsByChainId[toChain].icon} className="sbw-icon-img-1" />}
                    </div>
                    <div className="sbw-width-100">
                      <div className="sbw-text-1">
                        <div className="sbw-box-2">
                          <select
                            id="inputChainId"
                            name="inputChainId"
                            className="sbw-chain-select sbw-outline-none"
                            onChange={(el) => {setToChain(el.target.value)}}
                          >
                            {chainsByChainIdArr != undefined && chainsByChainIdArr.map(chain => {
                              if (chain.receivingEnabled !== true) return;
                              return (
                                <option
                                  key={chain.chainId}
                                  className="sbw-option"
                                  value={chain.chainId}
                                  selected={chain.chainId == toChain}
                                >
                                  {chain.name}
                                </option>
                              )
                            })}
                          </select>
                          <div className="sbw-down-arrow-box">
                            <DownArrowSvg style={{transform: 'rotate(90deg)'}}/>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default BridgeWidget;