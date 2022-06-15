import React, { useCallback, useContext, useEffect, useState } from "react";
import { useQuery } from "react-query";
import { getQuote } from "../../services";
import ChainsSelect from "./ChainsSelect";

import debounce from "lodash.debounce";

import { ChainIdContext } from "./WidgetWrapper";
import { TokenDetailsContext } from "./WidgetWrapper";
import { RoutesContext } from "./WidgetWrapper"; 
import TokensSelect from "./TokensSelect";
import { queryResponseObj } from "../../types";

let DEBOUNCE_TIMEOUT = 2000;
let fetchRoute = false;

// to check if inputTokenAmount is a valid amount
let regexp = new RegExp(/^(\d*)?(\.)?\d*$/);

let quoteList: queryResponseObj;

const MainComponent = () => {
  const { inputChainId, outputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails, outputTokenDetails } = useContext(TokenDetailsContext);
  const { selectedRoute, fetchQuotes, setRoutes, setSelectedRoute } = useContext(RoutesContext);
  const [inputTokenAmount, setInputTokenAmount] = useState("");
  const [fetchRoute1, setFetchRoute1] = useState(false);

  quoteList = useQuery(
    ["quoteList", inputTokenDetails.address, outputTokenDetails.address, inputTokenAmount],
    () => {
      console.log("calling");
      setFetchRoute1(false);
      setSelectedRoute({});
      setRoutes([]);
      return getQuote(
        {
          fromChainId: inputChainId.toString(),
          fromTokenAddress: inputTokenDetails.address,
          toChainId: outputChainId.toString(),
          toTokenAddress: outputTokenDetails.address,
          fromAmount: (parseFloat(inputTokenAmount) * (10 ** inputTokenDetails.decimals)).toLocaleString().split(',').join(''),
          userAddress: "0x087f5052fbcd7c02dd45fb9907c57f1eccc2be25",
          uniqueRoutesPerBridge: true,
          sort: "output",
          singleTxOnly: true
        }
      )
    }, {
    enabled: !!(inputTokenDetails.address && outputTokenDetails.address && regexp.test(inputTokenAmount) && fetchRoute1 === true && inputTokenAmount != "")
  }
  );

  useEffect(() => {
    console.log(quoteList);
    if (quoteList.isSuccess) {
      const response: any = quoteList.data?.data?.result;
      if (response?.routes.length) {
        setSelectedRoute(response?.routes[0]);
        setRoutes(response?.routes);
      }
      quoteList = {} as any;
    }
    console.log(quoteList);
  }, [quoteList.isSuccess, inputTokenDetails.address, outputTokenDetails.address, inputTokenAmount]);

  const debouncedCall = useCallback(
    debounce(() => {
      console.log("deb"); setFetchRoute1(true);
    }, DEBOUNCE_TIMEOUT),
    [], // will be created only once initially
  );
  
  useEffect(() => {
    if (!regexp.test(inputTokenAmount) || inputTokenAmount == "") {
      return;
    }

    const amount = (parseFloat(inputTokenAmount) * (10 ** inputTokenDetails.decimals)).toLocaleString().split(',').join('');
    console.log(amount);

    debouncedCall();

    // this is done so that we only make a request after the user stops typing
    // const timeout = setTimeout(() => {
    //   fetchRoute = true;
    // }, DEBOUNCE_TIMEOUT);
    // return () => {
    //   clearTimeout(timeout);
    // };
  }, [inputTokenAmount, inputTokenDetails.address, outputTokenDetails.address]);

  return (
    <>
      <div className="flex flex-col">
        <ChainsSelect />
        <div className="h-3"></div>
        <TokensSelect />
      </div>  
    </>
  );
};

export default React.memo(MainComponent);