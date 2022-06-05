import React from "react";
import { Widget } from "./Bridge";
import { darkTheme, Theme } from "../config";

export type BridgeWidgetProps = {
  apiKey: string;
  theme?: Theme;
  width?: number;
  defaultInputChainId?: number;
  defaultOutputChainId?: number;
} & typeof defaultProps;

const BridgeWidget = ({
  apiKey,
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
      width={width}
      defaultInputChainId={defaultInputChainId}
      defaultOutputChainId={defaultOutputChainId}
    />
  )
};

const defaultProps = {
  apiKey: "",
  theme: darkTheme,
  width: 400,
  defaultInputChainId: 1,
  defaultOutputChainId: 137
};

BridgeWidget.defaultProps = defaultProps;

export default BridgeWidget;