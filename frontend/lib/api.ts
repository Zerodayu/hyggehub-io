type QueryParams = Record<
  string,
  | string
  | number
  | boolean
  | null
  | undefined
  | Array<string | number | boolean>
>;

type ApiResponse<T> = { data: T };

export class ApiError extends Error {
  status: number;
  data: unknown;
  // Compatibility with previous axios-based callers that read `error.response.data`.
  response?: { data: unknown };

  constructor(message: string, opts: { status: number; data: unknown }) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.data = opts.data;
    this.response = { data: opts.data };
  }
}

function joinUrl(baseUrl: string, path: string) {
  const base = baseUrl.replace(/\/+$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}

function withParams(url: string, params?: QueryParams) {
  if (!params) return url;

  const u = new URL(url);
  for (const [key, raw] of Object.entries(params)) {
    if (raw === undefined || raw === null) continue;
    if (Array.isArray(raw)) {
      for (const v of raw) u.searchParams.append(key, String(v));
      continue;
    }
    u.searchParams.set(key, String(raw));
  }
  return u.toString();
}

function buildHeaders(extra?: HeadersInit): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    "x-api-key": process.env.NEXT_PUBLIC_API_KEY || "",
    "x-vercel-protection-bypass":
      process.env.VERCEL_AUTOMATION_BYPASS_SECRET || "",
  });
  if (extra) {
    const h = new Headers(extra);
    h.forEach((value, key) => headers.set(key, value));
  }
  return headers;
}

async function parseResponseBody(res: Response): Promise<unknown> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }
  try {
    return await res.text();
  } catch {
    return null;
  }
}

async function request<T>(
  method: string,
  path: string,
  opts?: {
    headers?: HeadersInit;
    params?: QueryParams;
    body?: unknown;
    timeoutMs?: number;
    // Allow Next.js caller overrides when needed.
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
  },
): Promise<ApiResponse<T>> {
  const baseURL = process.env.NEXT_PUBLIC_API_URL;
  if (!baseURL) throw new Error("NEXT_PUBLIC_API_URL is not set");

  const timeoutMs = opts?.timeoutMs ?? 10_000;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const url = withParams(joinUrl(baseURL, path), opts?.params);
    const headers = buildHeaders(opts?.headers);

    const init: RequestInit = {
      method,
      headers,
      signal: controller.signal,
      cache: opts?.cache ?? "no-store",
    };

    // Next.js' fetch supports `next`, Bun's fetch ignores unknown fields.
    // This keeps a single API surface for client + server.
    (init as RequestInit & { next?: NextFetchRequestConfig }).next = opts?.next;

    if (opts?.body !== undefined && method !== "GET" && method !== "HEAD") {
      init.body = JSON.stringify(opts.body);
    }

    const req = new Request(url, init);
    const res = await fetch(req);
    const data = (await parseResponseBody(res)) as T;
    if (!res.ok) {
      throw new ApiError(
        typeof (data as { error?: unknown } | null)?.error === "string"
          ? (data as { error: string }).error
          : `Request failed with status ${res.status}`,
        { status: res.status, data },
      );
    }
    return { data };
  } finally {
    clearTimeout(timeout);
  }
}

const api = {
  get: <T>(
    path: string,
    opts?: {
      headers?: HeadersInit;
      params?: QueryParams;
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
    },
  ) => request<T>("GET", path, opts),
  post: <T>(
    path: string,
    body?: unknown,
    opts?: {
      headers?: HeadersInit;
      params?: QueryParams;
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
    },
  ) => request<T>("POST", path, { ...opts, body }),
  put: <T>(
    path: string,
    body?: unknown,
    opts?: {
      headers?: HeadersInit;
      params?: QueryParams;
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
    },
  ) => request<T>("PUT", path, { ...opts, body }),
  delete: <T>(
    path: string,
    opts?: {
      headers?: HeadersInit;
      params?: QueryParams;
      cache?: RequestCache;
      next?: NextFetchRequestConfig;
    },
  ) => request<T>("DELETE", path, opts),
};

export default api;
