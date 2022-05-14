import ApiClient from "./apiClient";

export interface RequestProps {
  path: string;
  body?: object;
}

export const getReq = async ({ path }: RequestProps) => {
  try {
    const response = await ApiClient.get(path);
    return response;
  } catch (error) {
    throw error;
  }
};

export const postReq = async ({ path, body}: RequestProps) => {
  try {
    const response = await ApiClient.post(path, body);
    return response;
  } catch (error) {
    throw error;
  }
};