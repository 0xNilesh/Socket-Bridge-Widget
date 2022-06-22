import React, { useContext } from "react";
import { useQuery } from "react-query";
import { getTokenBalanceByTokenAddress } from "../../services";
import { queryResponseObj } from "../../types";
import InputTokenSelect from "./InputTokenSelect";
import OutputTokenSelect from "./OutputTokenSelect";
import { useWeb3Context } from "./Widget";
import { ChainIdContext, TokenDetailsContext } from "./WidgetWrapper";

let inputTokenBalance = "0";

const TokensSelect: React.FC = () => {
  const { account } = useContext(useWeb3Context);
  const { inputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails } = useContext(TokenDetailsContext);

  const tokenBalance: queryResponseObj = useQuery(
    ["tokenBalance", inputChainId, inputTokenDetails],
      () => getTokenBalanceByTokenAddress(
        {
          tokenAddress: inputTokenDetails.address,
          chainId: inputChainId.toString(),
          userAddress: account
        }
      ), {
      enabled: !!(account && account != "" && inputTokenDetails.address)
    }
  );

  if (tokenBalance.isSuccess) {
    let balance = tokenBalance.data?.data?.result.balance;
    let decimals = tokenBalance.data?.data?.result.decimals;
    inputTokenBalance = (balance / (10 ** decimals)).toPrecision(3).toString();
  }
  
  return (
    <>
        <InputTokenSelect />
        {account &&
          <>
            <div className="mt-1">
              <div className="text-bg3 text-sm">
                {<>{inputTokenBalance} {inputTokenDetails.symbol}</>}
              </div>    
            </div>
          </>
        }
        <div className="h-3"></div>
        <OutputTokenSelect />
    </>
  );
};

export default TokensSelect;