import { BLOG_API_BASE_URL } from "astro:env/client";
import ApiClient from "./ApiClient";
import type { AxiosError } from "axios";

export interface BlogPost {
  id?: Record;
  title: string;
  content: string;
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

export default class BlogApiClient extends ApiClient {
  constructor() {
    super(BLOG_API_BASE_URL);
  }

  public async createPost(post: BlogPost): Promise<Record | null> {
    try {
      const response = await this.post<Record>("/posts", post);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public async getPosts(): Promise<BlogPost[] | null> {
    try {
      const response = await this.get<BlogPost[]>("/posts");
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public async getPostById(id: string): Promise<BlogPost | null> {
    try {
      const response = await this.get<BlogPost>(`/posts/${id}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public async updatePost(id: string, post: BlogPost): Promise<Record | null> {
    try {
      const response = await this.put<Record>(`/posts/${id}`, post);
      return response.data;
    } catch (error) {
      this.handleError(error);
      return null;
    }
  }

  public async deletePost(id: string): Promise<Record | null> {
    try {
      const response = await this.delete<Record | null>(`/posts/${id}`);
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
