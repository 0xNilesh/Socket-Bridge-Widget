import React, { useContext, useRef, useState } from "react";
import { useClickAway } from "../../hooks";
import { useQuery } from "react-query";
import { getIfTokenSupported, getUserTokenBalances } from "../../services";
import { ethers } from "ethers";
import { useWeb3Context } from "../../contexts";
  
interface TokenDetail {
  address: string,
  symbol: string,
  icon: string,
  decimals: number
}

export interface queryResponseObj {
  isLoading: boolean,
  isError: boolean,
  isSuccess: boolean,
  error: Object | null,
  data: {
    data: {
      success: boolean,
      result: {
        [key: number | string]: any;
      }
    } | undefined
  } | undefined
};

type Props = {
  options: Array<{ chainId: number, name: string, icon: string, address: string, symbol: string, decimals: number }>;
  chainId: number;
  setTokenDetail: ({ address, symbol, icon }: TokenDetail) => void;
  onHide: (value: boolean) => void;
}

interface Obj {
  [key: string]: any;
}

const getUserBalanceOfChainId = (balances: any, chainId: number) => {
  if (!balances.isSuccess) return {};

  const data = balances.data?.data?.result;
  const balanceByChainId: Obj = {};
  data.map((balance: any) => {
    if (balance.chainId == chainId) {
      balanceByChainId[balance.address] = balance.amount;
    }
  });
  return balanceByChainId;
}

const TokenSelectDropdown = ({ options, setTokenDetail, onHide, chainId }: Props) => {
  options.sort((a, b) => a.symbol > b.symbol ? 1 : (a.symbol < b.symbol ? -1 : 0));

  const [moreOptions, setMoreOptions] = useState(options);
  const { account } = useContext(useWeb3Context);
  const [filteredResults, setFilteredResults] = useState(moreOptions);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddress, setIsAddress] = useState(false);
  const clickAwayRef = useRef<HTMLDivElement>(null);

  const balanceResponse = useQuery(
    ["userTokenBalances"],
    () => getUserTokenBalances(
      {
        userAddress: account
      }
    ), {
      enabled: !!(account && account != "")
    }
  );
  
  let newToken: any = {};
  const tokenSupport: queryResponseObj = useQuery(
    ["tokenSupport", isAddress],
    () => getIfTokenSupported(
      {
        chainId: chainId.toString(),
        tokenAddress: searchQuery
      }
    ), {
      enabled: !!isAddress
    }
  );

  if (tokenSupport.isSuccess) {
    if (tokenSupport.data?.data?.result.isSupported) {
      newToken = tokenSupport.data?.data?.result.token;
    }
  }

  const handleSearch = (searchQuery: string) => {
    const result: any = [];
    moreOptions.map(option => {
      if (option.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        option.address.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        result.push(option);
      }
    });
    setFilteredResults(result);

    if (result.length === 0) {
      if (ethers.utils.isAddress(searchQuery)) {
        setIsAddress(true);
      } 
    }
  }

  const addNewToken = () => {
    const tokenDetail = newToken;
    newToken = {};
    let cust:any= localStorage.getItem('customTokens');
    if (cust) {
      cust = JSON.parse(cust); 
    } else {
      cust = {};
    }
    if (!cust[account]) cust[account] = {};
    if (!cust[account][chainId]) cust[account][chainId] = [];
    cust[account][chainId].push(tokenDetail);
    localStorage.setItem('customTokens', JSON.stringify(cust));
    setMoreOptions([tokenDetail, ...moreOptions]);
  }

  const tokenBalance = getUserBalanceOfChainId(balanceResponse, chainId);

  useClickAway(clickAwayRef, () => onHide(true));

  return (
    <div ref={clickAwayRef} className="absolute text-textColorPrimary bg-bgColorDropdown top-14 py-2 rounded-lg z-10 w-full">
      <div className="flex m-1 flex-col">
        <div className="w-full p-2.5">
          <input
            className="rounded-lg bg-bgColorSecondary hover:bg-bgColorPrimary p-2 w-full outline-none border-none"
            placeholder="Search Name or Address"
            onChange={(e) => {
              if (isAddress) setIsAddress(false);
              setSearchQuery(e.target.value);
              handleSearch(e.target.value);
            }}
            value={searchQuery}
            autoFocus
          />
        </div>
        <div className="flex flex-row my-2 text-xs text-textColorSecondary mx-2">
          <div className="grow ml-1">Token Name</div>
          <div className="mr-3">Balance</div>
        </div>
        <div style={{height: "310px", overflowY: "scroll"}}>
          {filteredResults.map((option) => {
            return (
              <div
                className="flex mx-2 my-3 p-1 rounded-lg h-10 items-center text-sm font-medium hover:cursor-pointer hover:bg-bgColorSecondary"
                onClick={() => {
                  setTokenDetail({ address: option.address, symbol: option.symbol, icon: option.icon, decimals: option.decimals });
                  onHide(true);
                }}
                key={option.address}
              >
                <img src={option.icon} className="w-7 h-7 rounded-full mr-2" />
                <div className="grow">
                  <div>{option.symbol}</div>
                  <div className="text-textColorSecondary text-sm">{option.name}</div>
                </div>
                <div>{tokenBalance[option.address] ? tokenBalance[option.address].toFixed(4) : "0.00"}</div>
              </div>
            );
          })}
          {(filteredResults.length === 0 && newToken.address) &&
            <div
              className="flex mx-2 my-3 p-1 rounded-lg h-10 items-center text-sm font-medium"
              key={newToken.address}
            >
              <img src={newToken.icon} className="w-7 h-7 rounded-full mr-2" />
              <div className="grow">
                <div>{newToken.symbol}</div>
                <div className="text-textColorSecondary text-sm">{newToken.name}</div>
              </div>
              {account &&
                <button
                  className="flex flex-row w-32 bg-pink-400 hover:bg-pink-800 w-full items-center justify-center whitespace-nowrap text-white rounded-lg font-medium text-sm px-3 h-10 cursor-pointer"
                  onClick={() => {
                    addNewToken();
                    setSearchQuery("");
                    handleSearch("");
                  }}
                >
                  Import Token
                </button>
              }
            </div>
          }
          {(filteredResults.length === 0 && !newToken.address) &&
            <div className="text-textColorSecondary font-medium text-base mt-2 ml-3">No Tokens Found</div>
          }
        </div>
      </div>
    </div>
  );
}

export default TokenSelectDropdown;