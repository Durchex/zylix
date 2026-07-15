import { useAuthStore } from "@/store/auth.store";

const API_BASE = "/api/v1";

export class ApiRequestError extends Error {
  status: number;
  details?: unknown;

  constructor(status: number, message: string, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

interface RequestOptions {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  skipAuthRetry?: boolean;
}

async function rawRequest(path: string, options: RequestOptions, accessToken: string | null) {
  const headers: Record<string, string> = {};
  if (options.body !== undefined) headers["Content-Type"] = "application/json";
  if (accessToken) headers["Authorization"] = `Bearer ${accessToken}`;

  return fetch(`${API_BASE}${path}`, {
    method: options.method ?? "GET",
    headers,
    credentials: "include",
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

/**
 * Shared fetch wrapper: attaches the in-memory access token, and on a 401
 * transparently tries the refresh endpoint once (the refresh token lives in
 * an httpOnly cookie the browser sends automatically) before retrying.
 */
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { accessToken, setSession, clearSession } = useAuthStore.getState();

  let res = await rawRequest(path, options, accessToken);

  if (res.status === 401 && !options.skipAuthRetry) {
    const refreshed = await rawRequest("/auth/refresh", { method: "POST" }, null);
    if (refreshed.ok) {
      const data = await refreshed.json();
      setSession(data.user, data.accessToken);
      res = await rawRequest(path, options, data.accessToken);
    } else {
      clearSession();
    }
  }

  const contentType = res.headers.get("content-type");
  const payload = contentType?.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    throw new ApiRequestError(
      res.status,
      payload?.error?.message ?? "Something went wrong. Please try again.",
      payload?.error?.details ?? payload?.error?.issues,
    );
  }

  return payload as T;
}
