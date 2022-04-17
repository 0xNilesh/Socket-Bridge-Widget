import { setUserAddress} from "../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";
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
  const [chainsByChainId, chainsByNameToId ] = getChainDataByChainId(chains.data?.result);
  console.log(chainsByChainId);
  console.log(chainsByNameToId);

  // React.useEffect(() => {
  //   if (!address) return;
  //   dispatch(setUserAddress(address));
  // })

  return (
    <>
      <div className="sbw-outer-box">

      </div>
    </>
  )
}

export default BridgeWidget;