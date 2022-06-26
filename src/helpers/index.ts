export { getChainDataByChainId, getBridgeDataByBridgeName } from "./DataHelper";

export { updateTokenList, updateCSS } from "./UpdateFnHelper";

// to check if inputTokenAmount is a valid amount
export const isValidInput = new RegExp(/^(\d*)?(\.)?\d*$/);