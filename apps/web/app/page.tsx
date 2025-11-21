"use client";

import { useState } from "react";
import { generateApiKey, protectedHello } from "../lib/api";

export default function Page() {
  const [apiKey, setApiKey] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("apiKey") : null
  );
  const [message, setMessage] = useState("");

  async function handleGenerateKey() {
    const key = await generateApiKey();
    setApiKey(key);
    localStorage.setItem("apiKey", key);
  }

  async function handleProtectedCall() {
    if (!apiKey) return;
    try {
      const result = await protectedHello(apiKey);
      setMessage(result.message);
    } catch {
      setMessage("Failed to call protected API");
    }
  }

  return (
    <main style={{ padding: 40 }}>
      <h1>Teamname API Demo</h1>

      <button onClick={handleGenerateKey}>
        Generate API Key
      </button>

      {apiKey && (
        <>
          <p>
            <strong>Your API Key:</strong> {apiKey}
          </p>

          <button onClick={handleProtectedCall}>
            Call Protected Route
          </button>
        </>
      )}

      {message && <p>Response: {message}</p>}
    </main>
  );
}

