const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

// Generate new API key
export async function generateApiKey(): Promise<string> {
  const res = await fetch(`${API_URL}/generate-key`, {
    method: "POST",
  });

  const data = await res.json();
  return data.apiKey;
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

  const data = await res.json();
  return data;
}

