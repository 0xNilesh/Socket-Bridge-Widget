export type Obj = {
  [key: number | string]: Object;
}

export type queryResponseObj = {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
  error: Object | null,
  data: {
    data: {
      success: boolean,
      result: {
        [key: number | string]: any;
      }
    } | undefined
  } | undefined
};

export type ChainDetail = {
  chainId: number;
  name: string;
  icon: string;
}

export type TokenDetail = {
  address: string,
  symbol: string,
  icon: string,
  decimals: number
}

export type ChainIdContent = {
  inputChainId: number;
  outputChainId: number;
  setInputChainId: (chainId: number) => void;
  setOutputChainId: (chainId: number) => void;
}

export type TabIndexContent = {
  tabIndex: number;
  setTabIndex: (index: number) => void;
}

export type TokenDetailsContent = {
  inputTokenDetails: TokenDetail;
  outputTokenDetails: TokenDetail;
  setInputTokenDetails: (Obj: TokenDetail) => void;
  setOutputTokenDetails: (Obj: TokenDetail) => void;
}

export type InputTokenAmountContent = {
  inputTokenAmount: string;
  setInputTokenAmount: (amount: string) => void;
  inputTokenList: any;
  outputTokenList: any;
}