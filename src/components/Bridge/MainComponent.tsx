import React from "react";
import ChainsSelect from "./ChainsSelect";
import TokensSelect from "./TokensSelect";

const MainComponent = () => {
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

export default MainComponent;