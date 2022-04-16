// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const socketApi = createApi({
  reducerPath: 'socketApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://backend.movr.network/v2/',
    prepareHeaders: (headers) => {
      headers.set('API-KEY', process.env.REACT_APP_API_KEY);
      return headers;
    }
  }),
  endpoints: (builder) => ({
    getSupportedChains: builder.query({
      query: () => ({
        url: `supported/chains`,
      })
    }),
    getUserTokenBalances: builder.query({
      query: ({userAddress}) => `balances?userAddress=${userAddress}`,
    }),
    getTokenBalanceByTokenAddress: builder.query({
      query: ({tokenAddress}) => `token-balance?tokenAddress=${tokenAddress}`,
    }),
    getTokenPriceByTokenAddress: builder.query({
      query: ({tokenAddress}) => `token-price?tokenAddress=${tokenAddress}`,
    }),
    getGasPriceByChainId: builder.query({
      query: ({chainId}) => `gas-price?chainId=${chainId}`,
    }),
    getFromTokenList: builder.query({
      query: ({fromChainId, isShortList}) => `from-token-list?fromChainId=${fromChainId}&isShortList=${isShortList}`,
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetSupportedChainsQuery,
  useGetUserTokenBalancesQuery,
  useGetTokenBalanceByTokenAddressQuery,
  useGetGasPriceByChainIdQuery,
  useGetTokenPriceByTokenAddressQuery,
  useGetFromTokenListQuery,
} = socketApi