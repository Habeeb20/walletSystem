import { ApiEndpoints } from '@/config/apiEndpoints';
import { ApiError } from '@/models/types';
import { SecureStorage } from '../security/secureStorage';
import { Connectivity } from './connectivity';
import { ensureTransportReady } from './sslPinning';

const TIMEOUT_MS = 30_000;

type UnauthorizedHandler = () => Promise<void>;

/**
 * Single shared HTTP client for the whole app: injects the bearer token, applies a timeout,
 * parses backend error bodies into ApiError, enforces optional TLS pinning, reports request
 * timing to Connectivity (for slow/offline detection), and force-logs-out on any 401/403
 * (revoked/expired token).
 */
class ApiClientImpl {
  /** Wired up from the app root once navigation exists, so a 401 anywhere can clear the session. */
  onUnauthorized?: UnauthorizedHandler;

  private async headers(auth: boolean) {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (auth) {
      const token = await SecureStorage.getToken();
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }

  private async request(method: string, path: string, body?: unknown, auth = true): Promise<any> {
    await ensureTransportReady();

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const started = Date.now();

    let response: Response;
    try {
      response = await fetch(ApiEndpoints.full(path), {
        method,
        headers: await this.headers(auth),
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
    } catch (e) {
      // No response at all: network error or our 30s timeout.
      Connectivity.reportRequest(Date.now() - started, false);
      throw e;
    } finally {
      clearTimeout(timer);
    }

    // Any HTTP response (even 401 or 500) proves the network works; only its speed matters.
    Connectivity.reportRequest(Date.now() - started, true);
    return this.handle(response);
  }

  private async handle(response: Response): Promise<any> {
    const isJson = response.headers.get('content-type')?.includes('application/json') ?? false;
    let decoded: unknown = null;
    if (isJson) {
      const text = await response.text();
      if (text) {
        try {
          decoded = JSON.parse(text);
        } catch {
          decoded = null;
        }
      }
    }

    if (response.status >= 200 && response.status < 300) return decoded;

    if (response.status === 401 || response.status === 403) {
      void this.onUnauthorized?.();
    }

    if (decoded && typeof decoded === 'object' && !Array.isArray(decoded)) {
      throw ApiError.fromJson(decoded as Record<string, unknown>);
    }
    throw new ApiError(`Request failed (${response.status})`);
  }

  get = (path: string, auth = true) => this.request('GET', path, undefined, auth);
  post = (path: string, body?: Record<string, unknown>, auth = true) =>
    this.request('POST', path, body, auth);
  delete = (path: string, auth = true) => this.request('DELETE', path, undefined, auth);
}

export const ApiClient = new ApiClientImpl();