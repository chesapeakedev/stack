# GitHub OAuth Authentication

This package provides frontend components and utilities for GitHub OAuth
authentication. It supports both **config-over-convention** (full control) and
**convention-over-configuration** (sensible defaults) approaches.

## Features

- 🔐 Secure OAuth flow (client secret never exposed to frontend)
- ⚙️ Two API styles: configurable and default
- 🎨 React components for auth provider and callback handling
- 📦 TypeScript types for type safety
- 🔄 Automatic user state management with localStorage
- 🔧 Support for both frontend-initiated and backend-handled OAuth flows

## Installation

This package is part of the `@chesapeake/shared-components` package. Import
from:

```typescript
import { ... } from "@shared/components/ux/auth/github";
```

## Quick Start (Convention-over-Configuration)

For most use cases, the default client provides sensible defaults:

### 1. Environment Variables

Add to your `.env` file:

```env
VITE_GITHUB_CLIENT_ID=your_github_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
```

Or, if your backend handles OAuth initiation:

```env
VITE_GITHUB_BACKEND_INIT_ENDPOINT=/api/auth/github
```

### 2. Setup Auth Provider

```tsx
import {
  DefaultGitHubAuthProvider,
  useGitHubAuth,
} from "@shared/components/ux/auth/github";
import { defaultInitiateGitHubLogin } from "@shared/components/ux/auth/github";

function App() {
  return (
    <DefaultGitHubAuthProvider>
      <YourApp />
    </DefaultGitHubAuthProvider>
  );
}

function LoginButton() {
  const { signInWithGitHub } = useGitHubAuth();

  return <button onClick={signInWithGitHub}>Sign in with GitHub</button>;
}
```

## Backend Implementation

### API Contract

**Endpoint:** `POST /api/auth/github/callback`

**Request:**

```json
{
  "code": "authorization_code_from_github",
  "state": "optional_state_parameter"
}
```

**Response:**

```json
{
  "user": {
    "id": 12345678,
    "login": "username",
    "name": "User Name",
    "email": "user@example.com",
    "avatar_url": "https://avatars.githubusercontent.com/u/12345678"
  }
}
```

### Backend-Handled OAuth Flow

If your backend handles the entire OAuth flow (initiation and callback),
configure the client with `backendInitEndpoint`:

```tsx
import { GitHubAuthProvider } from "@shared/components/ux/auth/github";

function App() {
  return (
    <GitHubAuthProvider
      config={{
        clientId: "", // Not needed when using backend endpoint
        redirectUri: window.location.origin + "/api/auth/github/callback",
        backendInitEndpoint: "/api/auth/github", // Backend handles OAuth initiation
      }}
    >
      <YourApp />
    </GitHubAuthProvider>
  );
}
```

### Minimal Deno Implementation

Here's a complete example for Deno:

```typescript
// Backend OAuth initiation endpoint
async function handleGitHubAuth(req: Request): Promise<Response> {
  const GITHUB_CLIENT_ID = Deno.env.get("GITHUB_CLIENT_ID");
  const GITHUB_REDIRECT_URI = Deno.env.get("GITHUB_REDIRECT_URI");

  const state = crypto.randomUUID();
  const authUrl = new URL("https://github.com/login/oauth/authorize");
  authUrl.searchParams.set("client_id", GITHUB_CLIENT_ID!);
  authUrl.searchParams.set("redirect_uri", GITHUB_REDIRECT_URI);
  authUrl.searchParams.set("scope", "user:email");
  authUrl.searchParams.set("state", state);

  // Store state for validation
  await kv.set(["oauth_state", state], { expiresAt: Date.now() + 600000 });

  return Response.redirect(authUrl.toString());
}

// Backend OAuth callback endpoint
async function handleGitHubCallback(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Validate state
  const stateResult = await kv.get(["oauth_state", state!]);
  if (!stateResult.value) {
    return new Response("Invalid state", { status: 400 });
  }
  await kv.delete(["oauth_state", state!]);

  // Exchange code for token
  const tokenResponse = await fetch(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: Deno.env.get("GITHUB_CLIENT_ID")!,
        client_secret: Deno.env.get("GITHUB_CLIENT_SECRET")!,
        code: code!,
        redirect_uri: Deno.env.get("GITHUB_REDIRECT_URI")!,
      }),
    },
  );

  const tokenData = await tokenResponse.json();
  const accessToken = tokenData.access_token;

  // Get user data
  const userResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  const user = await userResponse.json();

  // Return user profile
  return new Response(
    JSON.stringify({
      user: {
        id: user.id,
        login: user.login,
        name: user.name,
        email: user.email,
        avatar_url: user.avatar_url,
      },
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
}
```

## Advanced Usage

See the main [auth README](../README.md) for multi-provider setup and advanced
configuration options.
