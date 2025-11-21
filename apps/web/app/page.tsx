"use client";

import { useEffect, useState } from "react";
import {
  type ApiKeyListItem,
  type GeneratedApiKey,
  deleteApiKey,
  fetchApiKeys,
  generateApiKey,
  protectedHello,
} from "../lib/api";

type StatusTone = "success" | "error" | "info";

export default function Page() {
  const [keys, setKeys] = useState<ApiKeyListItem[]>([]);
  const [freshKey, setFreshKey] = useState<GeneratedApiKey | null>(null);
  const [statusText, setStatusText] = useState("");
  const [statusTone, setStatusTone] = useState<StatusTone>("info");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);
  const [copied, setCopied] = useState(false);
  const [listError, setListError] = useState<string | null>(null);

  useEffect(() => {
    loadKeys();
  }, []);

  async function loadKeys() {
    try {
      setIsLoadingKeys(true);
      setListError(null);
      const data = await fetchApiKeys();
      setKeys(data);
    } catch (error) {
      console.error(error);
      setListError("Failed to load API keys. Please try again.");
    } finally {
      setIsLoadingKeys(false);
    }
  }

  async function handleGenerateKey() {
    setIsGenerating(true);
    setStatusText("");
    setStatusTone("info");
    try {
      const newKey = await generateApiKey();
      setFreshKey(newKey);
      setCopied(false);
      setKeys((current) => [
        {
          id: newKey.id,
          prefix: newKey.prefix,
          maskedKey: newKey.maskedKey,
          expiresAt: newKey.expiresAt,
        },
        ...current.filter((item) => item.id !== newKey.id),
      ]);
      setStatusTone("success");
      setStatusText("New API key generated. Copy it now.");
    } catch (error) {
      console.error(error);
      setStatusTone("error");
      setStatusText("Failed to generate API key.");
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleProtectedCall() {
    if (!freshKey?.apiKey) {
      setStatusTone("error");
      setStatusText("Generate and copy a key before calling the protected endpoint.");
      return;
    }
    setIsCalling(true);
    setStatusText("");
    try {
      const result = await protectedHello(freshKey.apiKey);
      setStatusTone("success");
      setStatusText(result.message || "Protected route responded successfully.");
    } catch (error) {
      console.error(error);
      setStatusTone("error");
      setStatusText("Protected route call failed. Please confirm the key or generate a new one.");
    } finally {
      setIsCalling(false);
    }
  }

  async function handleCopy() {
    if (!freshKey?.apiKey) return;
    try {
      if (!navigator.clipboard) {
        setStatusTone("info");
        setStatusText("Copy is not available here. Highlight the key and copy it manually.");
        return;
      }

      await navigator.clipboard.writeText(freshKey.apiKey);
      setCopied(true);
      setStatusTone("success");
      setStatusText("Copied to clipboard. Keep it safe.");
      setTimeout(() => setCopied(false), 1600);
    } catch (error) {
      console.error(error);
      setStatusTone("error");
      setStatusText("Could not copy the key. Please try again.");
    }
  }

  async function handleDelete(id: string) {
    setIsDeletingId(id);
    setStatusText("");
    try {
      await deleteApiKey(id);
      setKeys((current) => current.filter((item) => item.id !== id));
      setStatusTone("info");
      setStatusText("API key deleted.");
    } catch (error) {
      console.error(error);
      setStatusTone("error");
      setStatusText("Failed to delete API key.");
    } finally {
      setIsDeletingId(null);
    }
  }

  return (
    <main className="api-shell">
      <div className="sunrise-veil" />
      <section className="manager-card">
        <header className="card-header">
          <p className="card-eyebrow">Industrial MakerSpace</p>
          <h1 className="card-title">Industrial MakerSpace API Key Manager</h1>
          <p className="card-subtitle">Generate and manage your API keys</p>
          <a className="doc-link" href="/docs">
            View API Documentation →
          </a>
        </header>

        <button
          className="primary-action"
          onClick={handleGenerateKey}
          disabled={isGenerating}
        >
          {isGenerating ? "Generating..." : "Generate New API Key"}
        </button>

        {freshKey ? (
          <div className="save-card">
            <div className="save-header">
              <span className="save-icon">!</span>
              <div>
                <p className="save-title">Save your API key now!</p>
                <p className="save-subtext">This is the only time you&apos;ll see this key. Copy it now.</p>
              </div>
            </div>
            <div className="save-row">
              <input
                className="save-input"
                value={freshKey.apiKey}
                readOnly
                aria-label="New API key"
              />
              <button className="copy-button" onClick={handleCopy}>
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        ) : null}

        <div className="section">
          <p className="section-title">Your API Keys</p>
          {isLoadingKeys ? (
            <div className="list-placeholder">Loading API keys…</div>
          ) : listError ? (
            <p className="error-text">{listError}</p>
          ) : keys.length === 0 ? (
            <p className="empty-text">No API keys yet. Generate your first one to get started.</p>
          ) : (
            <div className="key-list">
              {keys.map((item) => (
                <div key={item.id} className="key-card">
                  <div className="key-details">
                    <p className="key-value">{item.maskedKey}</p>
                    <p className="key-expiry">Expires: {item.expiresAt}</p>
                  </div>
                  <div className="key-actions">
                    <button
                      className="delete-button"
                      onClick={() => handleDelete(item.id)}
                      disabled={isDeletingId === item.id}
                    >
                      {isDeletingId === item.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="section">
          <p className="section-title">Test Your Key</p>
          <button
            className="secondary-action"
            onClick={handleProtectedCall}
            disabled={!freshKey || isCalling}
          >
            {isCalling ? "Calling..." : "Call Protected Endpoint"}
          </button>
        </div>

        {statusText ? (
          <div className={`status-banner ${statusTone}`}>{statusText}</div>
        ) : (
          <p className="card-hint">Keys live server-side. New keys appear once—copy them right away.</p>
        )}
      </section>
    </main>
  );
}
