import { useMemo } from "react";
import { useQuery } from "react-query";
import { ApiClient, ApiClientService } from "./api-client.service";

export function useApiClient(): ApiClient {
    const apiClient = useMemo(() => new ApiClientService("http://localhost:3000"), []);
    return apiClient;
}

export function useListProperties(page: number, limit: number) {
    const apiClient = useApiClient();
    const result =  useQuery(["properties", page, limit], () => { return apiClient.listProperties(page, limit)}, {retryDelay:0, retry: 1});
    const {data, error, isLoading} = result;

    return {data, error, isLoading}
}