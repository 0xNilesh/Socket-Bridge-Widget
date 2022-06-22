import React, { useEffect, useState } from "react";
import WidgetWrapper from "./WidgetWrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import { Web3Provider } from '@ethersproject/providers';
import { Theme } from "../../config";
import { useWeb3 } from "../../hooks";
import { PropsContext, useWeb3Context } from "../../contexts";

const queryClient = new QueryClient();

export interface WidgetProps {
  apiKey: string;
  provider: Web3Provider;
  theme: Theme;
  width: string;
  defaultInputChainId: number;
  defaultOutputChainId: number;
}

const updateCSS = (themeObj: Theme) => {
  if(themeObj.bg)
  document.documentElement.style
      .setProperty('--bg1', themeObj.bg);
  
  if(themeObj.bgLight)
  document.documentElement.style
      .setProperty('--bgl', themeObj.bgLight);
  
  if(themeObj.fontColor)
  document.documentElement.style
      .setProperty('--fc', themeObj.fontColor);
}

const Widget = ({
  apiKey,
  provider,
  theme,
  width,
  defaultInputChainId,
  defaultOutputChainId
}: WidgetProps) => {
  
  const [account, setAccount] = useState("");
  const [chainId, setChainId] = useState({} as any);
  const [signer, setSigner] = useState({} as any);
  const [w3Provider, setW3Provider] = useState({} as any);

  useEffect(() => {
    const fetchDetails = async () => {
      const { account, chainId, signer, w3Provider } = await useWeb3(provider);
      setAccount(account);
      setChainId(chainId);
      setSigner(signer);
      setW3Provider(w3Provider);
    };
    fetchDetails();
  }, [provider]);

  sessionStorage.setItem('apiKey', apiKey);
  updateCSS(theme);

  return (
    <QueryClientProvider client={queryClient}>
      <PropsContext.Provider value={{
        width: width,
        defaultInputChainId: defaultInputChainId,
        defaultOutputChainId: defaultOutputChainId
      }}>
        <useWeb3Context.Provider value={{account, chainId, signer, w3Provider}}>
          <WidgetWrapper />
        </useWeb3Context.Provider>
      </PropsContext.Provider>
    </QueryClientProvider>
  );
}

export default Widget;

/*
  Select Gas Component - Confused
  Add themes - Tuesday
  Transfer Button and methods - Monday
  Final Progress Component - Monday
  Readme - Tuesday
*/