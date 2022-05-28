import React from "react";
import Wid from "./wid";
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

  return (
    <QueryClientProvider client={queryClient}>
      <div style={{margin:'25px'}}>
        <Wid />
      </div>
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