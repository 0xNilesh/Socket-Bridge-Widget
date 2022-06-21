import getAccount from "./getAccount";
import getChainId from "./getChainId";
import getSigner from "./getSigner";

const useWeb3 = async (provider: any) => {
  let account;
  let chainId;
  let signer;
  const w3Provider = provider;

  if (Object.keys(provider).length === 0) return { account, chainId, signer, w3Provider };

  account = await getAccount(provider);
  chainId = await getChainId(provider);
  signer = await getSigner(provider, account);

  return {account, chainId, signer, w3Provider};
}

export default useWeb3;