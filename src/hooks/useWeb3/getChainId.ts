import { Web3Provider } from "@ethersproject/providers";

const getChainId = async (provider: Web3Provider) => {
  if (Object.keys(provider).length === 0) return 0;

  return await provider.getNetwork().then(({chainId}) => chainId);
}

export default getChainId;