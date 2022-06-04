import React from "react";
import WidgetWrapper from "./WidgetWrapper";
import { QueryClient, QueryClientProvider } from "react-query";
import { Theme } from "../../config";

const queryClient = new QueryClient();

export interface WidgetProps {
  apiKey: string;
  theme: Theme;
  width: number;
  defaultInputChainId: number;
  defaultOutputChainId: number;
}

const updateCSS = (themeObj: Theme) => {
  if(themeObj.bg)
  document.documentElement.style
    .setProperty('--bg1', themeObj.bg);
}

const Widget = ({
  apiKey,
  theme,
  width,
  defaultInputChainId,
  defaultOutputChainId
}: WidgetProps) => {
  console.log({
    apiKey,
    theme,
    width,
    defaultInputChainId,
    defaultOutputChainId
  });

  sessionStorage.setItem('apiKey', apiKey);
  updateCSS(theme);

  return (
    <QueryClientProvider client={queryClient}>
        <WidgetWrapper />
    </QueryClientProvider>
  );
}

export default Widget;

/*
Main chains Component - After transfer (two buttons, Approve and Bridge)
Select Bridge Component
Select Gas Component
After Bridge txs Component
*/