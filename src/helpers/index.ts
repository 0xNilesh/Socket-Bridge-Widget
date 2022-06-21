export { getChainDataByChainId, getBridgeDataByBridgeName } from "./DataHelper";

export const updateTokenList = (chainId: number, tokenList: any, userAddress: string) => {
  let customList: any = localStorage.getItem('customTokens');
  if (customList) {
    customList = JSON.parse(customList);
    if (customList[userAddress] && customList[userAddress][chainId]) {
      return [...customList[userAddress][chainId], ...tokenList];
    }
  }
  return tokenList;
}

// to check if inputTokenAmount is a valid amount
export const isValidInput = new RegExp(/^(\d*)?(\.)?\d*$/);