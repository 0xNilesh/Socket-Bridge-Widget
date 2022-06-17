import React, { createContext, useContext, useState } from "react";
import { isValidInput } from "../../helpers";
import ChainsSelect from "./ChainsSelect";
import TokensSelect from "./TokensSelect";
import { RoutesContext } from "./WidgetWrapper";

type InputTokenAmountContent = {
  inputTokenAmount: string;
  setInputTokenAmount: (amount: string) => void;
}

export const InputTokenAmountContext = createContext<InputTokenAmountContent>({
  inputTokenAmount: "",
  setInputTokenAmount: () => {},
});

const MainComponent = () => {
  const [inputTokenAmount, setInputTokenAmount] = useState("");
  const { selectedRoute } = useContext(RoutesContext);

  return (
    <>
      <div className="flex flex-col">
        <ChainsSelect />
        <div className="h-3"></div>
        <InputTokenAmountContext.Provider value={{ inputTokenAmount, setInputTokenAmount }}>
          <TokensSelect />
        </InputTokenAmountContext.Provider>
        <div className="h-3"></div>
        <div className="h-3"></div>
        <div className="flex flex-col text-fc text-sm font-normal">
          <div className="flex flex-row justify-between">
            <div>Bridge</div>
            {
              Object.keys(selectedRoute).length === 0 || inputTokenAmount === "" || !isValidInput.test(inputTokenAmount) 
                ?
                <div>
                  —
                </div>
                :
                <button className="text-blue-500 capitalize">
                  {selectedRoute.usedBridgeNames[0]}
                </button>
            }
          </div>
          <div className="h-4"></div>
          <div className="flex flex-row justify-between">
            <div>Transfer Time</div>
            <div>—</div>
          </div>
          <div className="h-4"></div>
          <div className="flex flex-row justify-between">
            <div>Bridge Fee</div>
            <div>—</div>
          </div>
          <div className="h-4"></div>
          <div className="flex flex-row justify-between">
            <div>Network Fee</div>
            <div>—</div>
          </div>
        </div>
      </div>  
    </>
  );
};

export default MainComponent;