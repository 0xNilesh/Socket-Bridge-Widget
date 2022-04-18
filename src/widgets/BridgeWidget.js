import { setUserAddress} from "../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { ReactComponent as ArrowSvg } from "../assets/right-arrow.svg";
import "./BridgeWidget.css";

import { useGetSupportedChainsQuery } from "../services/socket";

const getChainDataByChainId = (chains) => {
  if (!chains) return [];
  const chainsByChainId = {}, chainsByNameToId = {};
  chains.forEach((chain) => {
    chainsByChainId[chain.chainId] = chain;
    chainsByNameToId[chain.name] = chain.chainId;
  });
  return [ chainsByChainId, chainsByNameToId ];
}

const BridgeWidget = ({ address, provider }) => {
  const dispatch = useDispatch();
  const chains = useGetSupportedChainsQuery();
  const [chainsByChainId, chainsByNameToId] = getChainDataByChainId(chains.data?.result);
  console.log(chainsByChainId);
  console.log(chainsByNameToId);

  // React.useEffect(() => {
  //   if (!address) return;
  //   dispatch(setUserAddress(address));
  // })

  return (
    <>
      <div className="sbw-container sbw-outer-box">
        <form>
          <div className="sbw-inner-box">
            <div className="sbw-switch-bridge-type">
              <label>
                <div className="sbw-box-1">Max Received</div>
                <input type="radio" value="amount" name="bridgeSortType" checked />
                <div className="sbw-hidden-box"></div>
              </label>
              <label>
                <div className="sbw-box-1">Fastest Transfer</div>
                <input type="radio" value="time" name="bridgeSortType" />
                <div className="sbw-hidden-box"></div>
              </label>
            </div>
            <div></div>
            <div className="sbw-chains-select-box">
              <fieldset className="sbw-fieldset">
                <div className="sbw-grid-col-box">
                  <label>From Network</label>
                </div>
              </fieldset>
              <button className="sbw-arrow-button">
                <div className="sbw-icon-box-1">
                  <ArrowSvg />
                </div>
              </button>
              <fieldset className="sbw-fieldset">
                <div className="sbw-grid-col-box">
                  <label>To Network</label>
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