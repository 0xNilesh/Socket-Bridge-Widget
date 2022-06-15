export interface Obj {
  [key: number | string]: Object;
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

export type ChainDetail = {
  chainId: number;
  name: string;
  icon: string;
}