const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export type ApiKeyListItem = {
  id: string;
  prefix: string;
  maskedKey: string;
  expiresAt: string;
  createdAt?: string;
};

export type GeneratedApiKey = {
  id: string;
  apiKey: string;
  prefix: string;
  maskedKey: string;
  expiresAt: string;
};

export async function fetchApiKeys(): Promise<ApiKeyListItem[]> {
  const res = await fetch(`${API_URL}/keys`);
  if (!res.ok) {
    throw new Error("Failed to load API keys.");
  }

  const data = await res.json();
  return (data.keys ?? []).map((item: any) => ({
    id: item.id,
    prefix: item.prefix,
    maskedKey: item.maskedKey ?? `${item.prefix ?? ""}...`,
    expiresAt: item.expiresAt ?? "",
    createdAt: item.createdAt,
  }));
}

// Generate new API key
export async function generateApiKey(): Promise<GeneratedApiKey> {
  const res = await fetch(`${API_URL}/generate-key`, {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error("Failed to generate API key.");
  }

  const data = await res.json();
  return {
    id: data.id,
    apiKey: data.apiKey,
    prefix: data.prefix,
    maskedKey: data.maskedKey ?? `${data.prefix ?? ""}...`,
    expiresAt: data.expiresAt ?? "",
  };
}

export async function deleteApiKey(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/keys/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Failed to delete API key.");
  }
}

// Call a protected route using your API key
export async function protectedHello(apiKey: string) {
  const res = await fetch(`${API_URL}/hello`, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!res.ok) {
    throw new Error("Invalid API key or request failed.");
  }

  return res.json();
}
