import Link from "next/link";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const protectedEndpoints = [
  {
    method: "GET",
    path: "/hello",
    description: "Simple hello endpoint to test authentication.",
    response: `{
  "message": "Hello from the hashed in-memory API!"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/description",
    description: "Returns a textual description of the team.",
    response: `{
  "description": "We are team \"Lorax\" and can now also code API endpoints. 🚀"
}`,
  },
  {
    method: "GET",
    path: "/api/v1/team",
    description: "Returns team information including name and members.",
    response: `{
  "team": {
    "name": "Industrial MakerSpace",
    "members": ["Joe", "Katy", "Malte", "Jinjun"]
  }
}`,
  },
  {
    method: "GET",
    path: "/api/v1/teamsize",
    description: "Returns the number of team members.",
    response: `{
  "size": 4
}`,
  },
  {
    method: "GET",
    path: "/api/v1/images",
    description: "Returns team member images as base64-encoded data.",
    response: `{
  "images": [
    {
      "name": "Joe",
      "data": "iVBORw0KGgo... (base64 for Joe Enno Karl Lammers.png)"
    },
    {
      "name": "Katy",
      "data": "iVBORw0KGgo... (base64 for Katy Grossmann.png)"
    },
    {
      "name": "Malte",
      "data": "iVBORw0KGgo... (base64 for Malte Oberhoff.png)"
    },
    {
      "name": "Jinjun",
      "data": "iVBORw0KGgo... (base64 for Jinjun Dong.png)"
    }
  ]
}`,
  },
];

const publicEndpoints = [
  {
    method: "POST",
    path: "/generate-key",
    description: "Generate a new API key.",
    response: `{
  "apiKey": "7e589b36-bf6a-438a-adcf-bcb323238e40",
  "id": "8b29deaf-f989-41fe-a581-8920ec89de10",
  "prefix": "7e589b36"
}`,
  },
  {
    method: "GET",
    path: "/keys",
    description: "List all API keys (shows only prefixes for security).",
    response: `{
  "keys": [
    {
      "id": "8b29deaf-f989-41fe-a581-8920ec89de10",
      "prefix": "7e589b36"
    }
  ]
}`,
  },
  {
    method: "DELETE",
    path: "/keys/:id",
    description: "Delete an API key by its ID.",
    response: `{
  "success": true
}`,
  },
];

const errorResponses = [
  {
    code: "401",
    title: "Unauthorized",
    description: "Invalid or missing API key",
    response: `{
  "error": "Invalid or missing API key"
}`,
  },
  {
    code: "404",
    title: "Not Found",
    description: "API key not found when trying to delete.",
    response: `{
  "error": "Key not found"
}`,
  },
];

function methodTone(method: string) {
  if (method === "GET") return "get";
  if (method === "POST") return "post";
  if (method === "DELETE") return "delete";
  return "get";
}

export default function DocsPage() {
  return (
    <main className="api-shell docs-shell">
      <div className="sunrise-veil" />
      <section className="docs-card">
        <div className="docs-nav">
          <Link href="/" className="back-link">
            ← Back to Dashboard
          </Link>
        </div>

        <div className="docs-hero">
          <h1 className="docs-title">API Documentation</h1>
          <p className="docs-subtitle">Industrial MakerSpace API v1</p>
        </div>

        <div className="docs-divider" />

        <section className="doc-section">
          <p className="section-heading">Authentication</p>
          <p className="section-body">
            All API endpoints require authentication via an API key passed in the request header.
          </p>
          <div className="code-block">
            <code>X-API-Key: your-api-key-here</code>
          </div>
        </section>

        <section className="doc-section">
          <p className="section-heading">Base URL</p>
          <div className="code-block">
            <code>{BASE_URL}</code>
          </div>
        </section>

        <section className="doc-section">
          <div className="section-header">
            <p className="section-heading">Endpoints</p>
          </div>
          <div className="docs-divider faint" />
          <div className="endpoint-grid">
            {protectedEndpoints.map((endpoint) => (
              <div className="endpoint-card" key={`${endpoint.method}-${endpoint.path}`}>
                <div className="endpoint-head">
                  <span className={`method-pill ${methodTone(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="endpoint-path">{endpoint.path}</span>
                </div>
                <p className="endpoint-copy">{endpoint.description}</p>
                <p className="endpoint-label">Response</p>
                <pre className="code-block">
                  <code>{endpoint.response}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section className="doc-section">
          <div className="section-header">
            <p className="section-heading">Key Management (Public)</p>
            <p className="section-body subtle">These endpoints do not require authentication.</p>
          </div>
          <div className="docs-divider faint" />
          <div className="endpoint-grid">
            {publicEndpoints.map((endpoint) => (
              <div className="endpoint-card" key={`${endpoint.method}-${endpoint.path}`}>
                <div className="endpoint-head">
                  <span className={`method-pill ${methodTone(endpoint.method)}`}>
                    {endpoint.method}
                  </span>
                  <span className="endpoint-path">{endpoint.path}</span>
                </div>
                <p className="endpoint-copy">{endpoint.description}</p>
                <p className="endpoint-label">Response</p>
                <pre className="code-block">
                  <code>{endpoint.response}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>

        <section className="doc-section">
          <div className="section-header">
            <p className="section-heading">Error Responses</p>
          </div>
          <div className="docs-divider faint" />
          <div className="error-grid">
            {errorResponses.map((err) => (
              <div className="error-card" key={err.code}>
                <div className="error-head">
                  <span className="error-code">{err.code}</span>
                  <span className="error-title">{err.title}</span>
                </div>
                <p className="endpoint-copy">{err.description}</p>
                <p className="endpoint-label">Response</p>
                <pre className="code-block">
                  <code>{err.response}</code>
                </pre>
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
