import React from "react";
import { useQuery } from "react-query";
import getSupportedChains from "../../services";

const Wid = () => {
  const { isLoading, data} = useQuery(["chains"], getSupportedChains);

  if (isLoading) console.log("Loading...");
  else console.log('', data);

  return <div>Hello</div>;
}

export default Wid;