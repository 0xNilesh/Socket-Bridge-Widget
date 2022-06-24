import React, { useContext, useEffect } from "react";
import { useQuery } from "react-query";
import { ChainIdContext, InputTokenBalanceContext, TokenDetailsContext, useWeb3Context } from "../../contexts";
import { getTokenBalanceByTokenAddress } from "../../services";
import { queryResponseObj } from "../../types";
import InputTokenSelect from "./InputTokenSelect";
import OutputTokenSelect from "./OutputTokenSelect";

let tokenBalance: queryResponseObj;

const TokensSelect: React.FC = () => {
  const { account } = useContext(useWeb3Context);
  const { inputChainId } = useContext(ChainIdContext);
  const { inputTokenDetails } = useContext(TokenDetailsContext);
  const { inputTokenBalance, setInputTokenBalance } = useContext(InputTokenBalanceContext);

  tokenBalance = useQuery(
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

  useEffect(() => {
    if (tokenBalance.isSuccess) {
      let balance = tokenBalance.data?.data?.result.balance;
      let decimals = tokenBalance.data?.data?.result.decimals;
      let inputBalance = (balance / (10 ** decimals)).toFixed(3).toString();
      setInputTokenBalance(inputBalance);
    }
  }, [tokenBalance.isLoading, inputChainId, inputTokenDetails]);

  return (
    <>
        <InputTokenSelect />
        {account &&
          <>
            <div className="mt-1">
              <div className="text-bg3 text-sm">
                Balance: {<>{inputTokenBalance} {inputTokenDetails.symbol}</>}
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