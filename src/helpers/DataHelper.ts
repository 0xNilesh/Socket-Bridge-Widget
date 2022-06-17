import { Obj } from "../types";

export const getChainDataByChainId = (chains: any) => {
  if (!chains.isSuccess) return [];

  const data = chains.data?.data?.result;
  const chainsByChainId: any = {};
  const fromChainsList: Array<Obj> = [];
  const toChainsList: Array<Obj> = [];

	data.forEach((chain:any) => {
		chainsByChainId[chain.chainId] = chain;
    if (chain.sendingEnabled) {
      fromChainsList.push({
        chainId: chain.chainId,
        name: chain.name,
        icon: chain.icon
      });
    }
    if (chain.receivingEnabled) {
      toChainsList.push({
        chainId: chain.chainId,
        name: chain.name,
        icon: chain.icon
      });
    }
	});
  return [chainsByChainId, fromChainsList, toChainsList];
};

export const getBridgeDataByBridgeName = (bridges: any) => {
  if (!bridges.isSuccess) return [];

  const data = bridges.data?.data?.result;
  const bridgesByName: any = {};

  console.log(data, bridges);

  data.forEach((bridge: any) => {
    bridgesByName[bridge.bridgeName] = bridge;
  });
  
  return [bridgesByName];
};