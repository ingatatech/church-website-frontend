const protocol = process.env.NEXT_PUBLIC_API_PROTOCOL ?? "http";
const host = process.env.NEXT_PUBLIC_API_HOST ?? "localhost";
const port = process.env.NEXT_PUBLIC_API_PORT?.trim();
const apiPrefix = `/${(process.env.NEXT_PUBLIC_API_PREFIX ?? "api").replace(/^\/+|\/+$/g, "")}`;
const apiBase = `${protocol}://${host}${port ? `:${port}` : ""}${apiPrefix}`.replace(/\/$/, "");

type ApiEnvelope<T> = {
  success?: boolean;
  message?: string;
  data?: T;
  error?: string;
  statusCode?: number;
};

export async function authRequest<T>(path: string, body?: unknown): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body ?? {}),
    });
  } catch {
    throw new Error("We couldn’t reach the sign-in service. Check your connection and try again.");
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error ?? payload?.message ?? "That request could not be completed. Please try again.");
  }
  return payload?.data as T;
}

export async function authGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${apiBase}${path}`, {
      method: "GET",
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new Error("We couldn’t reach the sign-in service. Check your connection and try again.");
  }

  const payload = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;
  if (!response.ok || payload?.success === false) {
    throw new Error(payload?.error ?? payload?.message ?? "That request could not be completed. Please try again.");
  }
  return payload?.data as T;
}

export async function getPublicData<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${apiBase}${path}`, { cache: "no-store" });
    if (!response.ok) return null;
    const payload = (await response.json()) as { data?: T };
    return payload.data ?? null;
  } catch {
    return null;
  }
}

export type ChurchEvent = {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  description?: string | null;
  flyerUrl?: string | null;
  registrationRequired: boolean;
};

export type Sermon = {
  id: string;
  title: string;
  speaker: string;
  date: string;
  scripture?: string | null;
  category: string;
  description?: string | null;
  audioUrl?: string | null;
  videoUrl?: string | null;
};

export type PublicContent = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  details: Record<string, unknown>;
  publishedAt?: string | null;
};

export type Ministry = {
  id: string;
  name: string;
  description: string;
  leader?: string | null;
  imageUrl?: string | null;
};
