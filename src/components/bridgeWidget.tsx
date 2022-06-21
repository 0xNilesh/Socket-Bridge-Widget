import React from "react";
import { Widget } from "./Bridge";
import { darkTheme, Theme } from "../config";
import { Web3Provider } from '@ethersproject/providers';

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