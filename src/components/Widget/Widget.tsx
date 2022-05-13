import React from "react";
import Wid from "./wid";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const Widget = () => {
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