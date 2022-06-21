import { Web3Provider } from "@ethersproject/providers";

const getAccount = async (provider: Web3Provider) => {
  if (Object.keys(provider).length === 0) return "";

  return await provider.listAccounts().then((accounts: any) => accounts[0]);
}

export default getAccount;