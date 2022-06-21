import { Web3Provider } from "@ethersproject/providers";

const getSigner = async (provider: Web3Provider, account: string) => {
  if (Object.keys(provider).length === 0) return 0;

  return provider.getSigner(account);
}

export default getSigner;