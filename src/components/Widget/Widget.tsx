import React from "react";
import Wid from "./wid";
import { QueryClient, QueryClientProvider } from "react-query";
import { initiateApiClient } from "../../api";

const queryClient = new QueryClient();
const BASE_URL = "https://backend.movr.network/v2";

const Widget = (apiKey: string) => {
  initiateApiClient({ url: BASE_URL, apiKey: apiKey });

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