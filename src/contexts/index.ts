import { createContext } from "react";
import { ChainIdContent, InputTokenAmountContent, PropsContent, RoutesContent, SortTypeContent, TabIndexContent, TokenDetailsContent, useWeb3ProviderContent } from "../types";

export const TabIndexContext = createContext<TabIndexContent>({
  tabIndex: 0,
  setTabIndex: () => {}
});

export const ChainIdContext = createContext<ChainIdContent>({
  inputChainId: 1,
  outputChainId: 137,
  setInputChainId: () => {},
  setOutputChainId: () => {}
});

export const TokenDetailsContext = createContext<TokenDetailsContent>({
  inputTokenDetails: { address: "", symbol: "", icon: "", decimals: 0 },
  outputTokenDetails: { address: "", symbol: "", icon: "", decimals: 0 },
  setInputTokenDetails: () => { },
  setOutputTokenDetails: () => { }
});

export const InputTokenAmountContext = createContext<InputTokenAmountContent>({
  inputTokenAmount: "",
  setInputTokenAmount: () => { },
  inputTokenList: {},
  outputTokenList: {}
});

export const RoutesContext = createContext<RoutesContent>({
  selectedRoute: {} as any,
  routes: [],
  setRoutes: (routes: []) => { },
  setSelectedRoute: (routes: any) => { }
});

export const BridgesContext = createContext({
  bridgesByName: {} as any
});

export const SortTypeContext = createContext<SortTypeContent>({
  sortType: "output",
  setSortType: () => {}
});

export const WidgetWidthContext = createContext({
  widgetWidth: 0
});

export const InputTokenBalanceContext = createContext({
  inputTokenBalance: "0",
  setInputTokenBalance: (amount: string) => {}
});

export const PropsContext = createContext<PropsContent>({
  width: "100%",
  defaultInputChainId: 1,
  defaultOutputChainId: 137
});

export const useWeb3Context = createContext<useWeb3ProviderContent>({
  account: "",
  chainId: 0,
  signer: {},
  w3Provider: {}
});