import { BLOG_API_BASE_URL } from "astro:env/client";
import ApiClient from "./ApiClient";
import type { AxiosError } from "axios";

export interface GetUserBY {
  email?: string;
  username?: string;
  token?: string;
}

export interface UserInfo {
  email: string;
  url_safe_username: string;
  username: string;
  first_name: string;
  last_name: string;
  created_at: Date;
  last_login: Date | null;
  picture: string | null;
}

export interface Record {
  id: Thing;
}

export interface Thing {
  String: any; // typescript is dumb
  tb: string;
  id: ID;
}

export interface ID {
  String: string;
}

export default class AuthApiClient extends ApiClient {
  constructor() {
    super(BLOG_API_BASE_URL);
  }

  public async getUserInfo(data: GetUserBY): Promise<UserInfo | null> {
    let endpoint = `${this.baseURL}/user/by?`;

    if (!data.email && !data.token && !data.username) {
      console.error("No email or token provided.");
      return null;
    }

    if (data.email) {
      endpoint += `email=${data.email}`;
    }

    if (data.username) {
      endpoint += `username=${data.username}`;
    }

    if (data.token) {
      endpoint += `token=${data.token}`;
    }

    try {
      const response = await this.get<UserInfo>(endpoint);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  private handleError(error: unknown): void {
    if (this.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status other than 2xx
        console.error(`API Error: ${error.response.status} - ${error.response.statusText}`);
        console.error(`Response Data: ${JSON.stringify(error.response.data)}`);
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received from the server.");
      } else {
        // Something happened in setting up the request
        console.error(`Error setting up the request: ${error.message}`);
      }
    } else {
      console.error("An unexpected error occurred.", error);
    }
  }

  private isAxiosError(error: unknown): error is AxiosError {
    return (error as AxiosError).isAxiosError !== undefined;
  }
}
