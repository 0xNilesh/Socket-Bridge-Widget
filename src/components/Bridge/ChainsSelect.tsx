import React, { useContext } from "react";
import { ChainIdContext, ChainsContext, TokenDetailsContext, WidgetWidthContext } from "../../contexts";
import RightArrowSvg from "../../assets/right-arrow.svg";
import InputChainSelect from "./InputChainSelect";
import OutputChainSelect from "./OutputChainSelect";

const ChainsSelect: React.FC = () => {
  const { inputChainId, outputChainId, setInputChainId, setOutputChainId } = useContext(ChainIdContext);
  const { setInputTokenDetails, setOutputTokenDetails } = useContext(TokenDetailsContext);
  const { widgetWidth } = useContext(WidgetWidthContext);

  const {chainsByChainId, fromChainsList, toChainsList} = useContext(ChainsContext);

  const swap = () => {
    if (
      chainsByChainId[inputChainId].receivingEnabled === true &&
      chainsByChainId[outputChainId].sendingEnabled === true
    ) {
      const fromChain = inputChainId, toChain = outputChainId;
      setInputChainId(toChain);
      setOutputChainId(fromChain);
    }
  };

  return (
    <div
      id="chain-select"
      className={`${widgetWidth > 450 ? 'grid grid-cols-11' : 'flex flex-col'} gap-3 rounded-xl`}
    >
      <InputChainSelect
        chainsByChainId={chainsByChainId}
        fromChainsList={fromChainsList}
        swap={swap}
      />
      {widgetWidth > 450 &&
        <div id="swap-chains" className="self-center text-fc">
          <div
            className="flex justify-center items-center rounded-lg border-2 border-bgLight bg-pr h-7 hover:cursor-pointer hover:bg-bgLight"
            onClick={() => {
              setInputTokenDetails({ address: "", icon: "", symbol: "", decimals: 0 })
              setOutputTokenDetails({ address: "", icon: "", symbol: "", decimals: 0 })
              swap();
            }}
          >
            <RightArrowSvg className="h-3 w-3" />
          </div>
        </div>
      }
      <OutputChainSelect
        chainsByChainId={chainsByChainId}
        toChainsList={toChainsList}
        swap={swap}
      />
    </div>
  );
}

export default ChainsSelect;