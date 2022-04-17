import { setUserAddress} from "../redux/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import React from "react";

const BridgeWidget = ({ address, provider }) => {
  const dispatch = useDispatch();
  const { userAddress} = useSelector(state => state.user);

  React.useEffect(() => {
    if (!address) return;
    dispatch(setUserAddress(address));
  })

  console.log(userAddress);
  console.log(provider);

  return (
    <>
      Hello BridgeWidget
    </>
  )
}

export default BridgeWidget;