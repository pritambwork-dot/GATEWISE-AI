import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

declare const process: {
  env: Record<string, string | undefined>;
};

const SECURE_STORE_TOKEN_KEY = 'gatewise_auth_token';
const SECURE_STORE_USER_KEY = 'gatewise_auth_user';
const SECURE_STORE_SERVER_URL_KEY = 'gatewise_server_url';

// Priority order:
// 1. Explicit EXPO_PUBLIC_API_URL env variable (for physical devices & production APKs)
// 2. Android emulator host (10.0.2.2)
// 3. Localhost fallback
const ENV_API_URL = process.env.EXPO_PUBLIC_API_URL;
const DEFAULT_HOST = Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
export const API_BASE_URL = ENV_API_URL || `${DEFAULT_HOST}/api/v1`;

export class ApiClientError extends Error {
  statusCode: number;
  data: any;

  constructor(message: string, statusCode: number = 500, data?: any) {
    super(message);
    this.name = 'ApiClientError';
    this.statusCode = statusCode;
    this.data = data;
  }
}

class ApiClient {
  private token: string | null = null;
  private demoMode: boolean = false;

  constructor() {
    this.initToken();
  }

  private async initToken() {
    try {
      this.token = await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
    } catch {
      this.token = null;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      SecureStore.setItemAsync(SECURE_STORE_TOKEN_KEY, token).catch(() => {});
    } else {
      SecureStore.deleteItemAsync(SECURE_STORE_TOKEN_KEY).catch(() => {});
      SecureStore.deleteItemAsync(SECURE_STORE_USER_KEY).catch(() => {});
    }
  }

  setDemoMode(enabled: boolean) {
    this.demoMode = enabled;
  }

  isDemoMode(): boolean {
    return this.demoMode;
  }

  async getStoredToken(): Promise<string | null> {
    if (this.token) return this.token;
    try {
      this.token = await SecureStore.getItemAsync(SECURE_STORE_TOKEN_KEY);
      return this.token;
    } catch {
      return null;
    }
  }

  async request<T>(
    endpoint: string,
    options: {
      method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
      body?: any;
      headers?: Record<string, string>;
      timeoutMs?: number;
    } = {}
  ): Promise<T> {
    const { method = 'GET', body, headers = {}, timeoutMs = 8000 } = options;
    const token = await this.getStoredToken();

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    };

    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: requestHeaders,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch {
          errData = { detail: response.statusText };
        }
        throw new ApiClientError(
          errData.detail || `Request failed with status ${response.status}`,
          response.status,
          errData
        );
      }

      return (await response.json()) as T;
    } catch (err: any) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new ApiClientError('Network request timed out. Please verify connection.', 408);
      }
      if (err instanceof ApiClientError) {
        throw err;
      }
      throw new ApiClientError(err.message || 'Network connection failed.', 503);
    }
  }
}

export const apiClient = new ApiClient();
