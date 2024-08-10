import { apiClient } from "./ApiClient";
import { type Config, type ConfigRequest, type ConfigResponse } from "./models";

/**
 * Fetches configuration data from the API based on the provided request parameters.
 *
 * @param {ConfigRequest} data - The request parameters to fetch the configuration data.
 * @return {Config | null} The fetched configuration data, or null if the request fails.
 */
export async function fetchConfig(data: ConfigRequest): Promise<Config | null> {
    try {
        const res = await apiClient.get<ConfigResponse>("/api/config", { params: data, baseURL: apiClient.baseURL, withCredentials: false });
        
        if (res.status >= 200 && res.status < 300) {
            return res.data.config;
        } else if (res.status >= 400 && res.status < 500) {
            console.warn(`Client error: ${res.status} - ${res.statusText}`);
            return null;
        } else if (res.status >= 500) {
            console.error(`Server error: ${res.status} - ${res.statusText}`);
            return null;
        } else {
            console.warn(`Unexpected status code: ${res.status} - ${res.statusText}`);
            return null;
        }
    } catch (error) {
        console.error("Network or other unexpected error:", error);
        return null;
    }
}