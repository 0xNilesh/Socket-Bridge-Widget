import { Theme } from "../types";

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

export const updateCSS = (themeObj: Theme) => {
  if (themeObj.bgColorPrimary)
    document.documentElement.style
      .setProperty('--bgColorPrimary', themeObj.bgColorPrimary);
  
  if (themeObj.bgColorSecondary)
    document.documentElement.style
      .setProperty('--bgColorSecondary', themeObj.bgColorSecondary);
  
  if (themeObj.bgColorDropdown)
    document.documentElement.style
      .setProperty('--bgColorDropdown', themeObj.bgColorDropdown);
  
  if (themeObj.textColorPrimary)
    document.documentElement.style
      .setProperty('--textColorPrimary', themeObj.textColorPrimary);
  
  if (themeObj.textColorSecondary)
    document.documentElement.style
      .setProperty('--textColorSecondary', themeObj.textColorSecondary);
  
  if (themeObj.btnColorPrimary)
    document.documentElement.style
      .setProperty('--btnColorPrimary', themeObj.btnColorPrimary);
  
  if (themeObj.btnColorSecondary)
    document.documentElement.style
      .setProperty('--btnColorSecondary', themeObj.btnColorSecondary);
}