import React from "react";
import { Widget } from "./Bridge";
import { darkTheme, Theme } from "../config";
import { Web3Provider } from '@ethersproject/providers';
import useWeb3 from "../hooks/useWeb3";

export type BridgeWidgetProps = {
  apiKey: string;
  provider?: Web3Provider;
  theme?: Theme;
  width?: string;
  defaultInputChainId?: number;
  defaultOutputChainId?: number;
} & typeof defaultProps;

const BridgeWidget = ({
  apiKey,
  provider,
  theme,
  width,
  defaultInputChainId,
  defaultOutputChainId
}: BridgeWidgetProps) => {

  const themeObj: Theme = { ...darkTheme, ...theme };
  console.log(provider);
  
  // if (Object.keys(provider).length != 0) {
  //   console.log(provider);
  //   console.log(provider.getNetwork());
  //   console.log(provider.listAccounts());
  //   console.log(provider.getSigner());
  //   console.log(provider._getAddress);
  //   console.log(provider._network);
  //   console.log(provider.detectNetwork());
  //   console.log(provider.connection);
  //   console.log(provider.getNetwork());
  //   console.log(provider.network);
  // }

  return (
    <Widget
      apiKey={apiKey}
      theme={themeObj}
      provider={provider}
      width={width}
      defaultInputChainId={defaultInputChainId}
      defaultOutputChainId={defaultOutputChainId}
    />
  )
};

const defaultProps = {
  apiKey: "",
  provider: {},
  theme: darkTheme,
  width: 400,
  defaultInputChainId: 1,
  defaultOutputChainId: 137
};

BridgeWidget.defaultProps = defaultProps;

export default BridgeWidget;