const apiBase = (process.env.CHURCH_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5004/api").replace(/\/$/, "");

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
