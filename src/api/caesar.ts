import { apiClient } from "./ApiClient";
import { type CaesarRequest, type CaesarResponse } from "./models";

export async function caesar_encrypt(data: CaesarRequest): Promise<string | null> {
    try {
        const res = await apiClient.post<CaesarResponse>("/api/caesar/encrypt", data, { baseURL: apiClient.baseURL, withCredentials: false });
        if (res.status >= 200 && res.status < 300) {
            return res.data.output;
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

export async function caesar_decrypt(data: CaesarRequest): Promise<string | null> {
    try {
        const res = await apiClient.post<CaesarResponse>("/api/caesar/decrypt", data, { baseURL: apiClient.baseURL, withCredentials: false });
        if (res.status >= 200 && res.status < 300) {
            return res.data.output;
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