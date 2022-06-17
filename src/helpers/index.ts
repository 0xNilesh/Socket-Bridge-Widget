let userAddress = "0x087f5052fbcd7c02dd45fb9907c57f1eccc2be25";
export const updateTokenList = (chainId: number, tokenList: any) => {
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