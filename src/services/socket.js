// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

// Define a service using a base URL and expected endpoints
export const socketApi = createApi({
  reducerPath: 'socketApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://backend.movr.network/v2/' }),
  endpoints: (builder) => ({
    getSupportedChains: builder.query({
      query: () => ({
        url: `supported/chains`,
        headers: {
          'API-KEY': '645b2c8c-5825-4930-baf3-d9b997fcd88c',
        }
      })
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetSupportedChainsQuery } = socketApi