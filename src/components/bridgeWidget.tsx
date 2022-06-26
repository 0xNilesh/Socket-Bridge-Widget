import React from "react";
import { Widget } from "./Bridge";
import { darkTheme } from "../config";
import { Web3Provider } from '@ethersproject/providers';
import { Theme } from "../types";

type supportedChainIDs = 1 | 10 | 56 | 100 | 137 | 250 | 42161 | 43114 | 1313161554;

export type BridgeWidgetProps = {
  apiKey: string;
  provider?: Web3Provider;
  theme?: Theme;
  defaultInputChainId?: supportedChainIDs;
  defaultOutputChainId?: supportedChainIDs;
} & typeof defaultProps;

const BridgeWidget = ({
  apiKey,
  provider,
  theme,
  defaultInputChainId,
  defaultOutputChainId
}: BridgeWidgetProps) => {
  
  if (defaultOutputChainId === defaultInputChainId) {
    console.warn("Input ChainID and Output ChainID must be different");
    if (defaultOutputChainId === 1) {
      defaultOutputChainId = 137;
    } else {
      defaultOutputChainId = 1;
    }
  }

  const themeObj: Theme = { ...darkTheme, ...theme };

  return (
    <Widget
      apiKey={apiKey}
      theme={themeObj}
      provider={provider}
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