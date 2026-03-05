# Google OAuth Authentication

This package provides frontend components and utilities for Google OAuth
authentication. It supports both **config-over-convention** (full control) and
**convention-over-configuration** (sensible defaults) approaches.

## Features

- 🔐 Secure OAuth flow (client secret never exposed to frontend)
- ⚙️ Two API styles: configurable and default
- 🎨 React components for auth provider and callback handling
- 📦 TypeScript types for type safety
- 🔄 Automatic user state management with localStorage

## Installation

This package is part of `@chesapeake/stack`. Import from:

```typescript
import { ... } from "@shared/components/ux/auth/google";
```

## Quick Start (Convention-over-Configuration)

For most use cases, the default client provides sensible defaults:

### 1. Environment Variables

Add to your `.env` file:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
```

### 2. Setup Auth Provider

```tsx
import {
  DefaultGoogleAuthProvider,
  useGoogleAuth,
} from "@shared/components/ux/auth/google";
import { defaultInitiateGoogleLogin } from "@shared/components/ux/auth/google";

function App() {
  return (
    <DefaultGoogleAuthProvider>
      <YourApp />
    </DefaultGoogleAuthProvider>
  );
}

function LoginButton() {
  const { signInWithGoogle } = useGoogleAuth();

  return <button onClick={signInWithGoogle}>Sign in with Google</button>;
}
```

### 3. Handle OAuth Callback

```tsx
import { DefaultGoogleAuthCallback } from "@shared/components/ux/auth/google";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGoogleAuth } from "@shared/components/ux/auth/google";

function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { updateUser } = useGoogleAuth();
  const code = searchParams.get("code");

  if (!code) {
    return <div>No authorization code received</div>;
  }

  return (
    <DefaultGoogleAuthCallback
      code={code}
      onUserFound={async (profile) => {
        // User exists in your system
        // Update user state
        updateUser(profile);
        navigate("/home");
      }}
      onUserNotFound={async (profile) => {
        // New user - redirect to create account page
        navigate("/create-user");
      }}
      onError={(error) => {
        console.error("Auth error:", error);
        navigate("/login");
      }}
    />
  );
}
```

### 4. Backend Implementation

You need to implement a backend endpoint `POST /api/auth/google/callback` that:

1. Receives `{ code: string }` in the request body
2. Exchanges the code for tokens using Google's OAuth API (server-side)
3. Fetches user info from Google
4. Returns `{ user: GoogleOAuthProfile }`

See "Backend Implementation" section below for a complete Deno example.

## Advanced Usage (Config-over-Convention)

For full control over the OAuth flow:

```tsx
import {
  GoogleAuthClient,
  GoogleAuthProvider,
} from "@shared/components/ux/auth/google";
import type { GoogleAuthConfig } from "@shared/components/ux/auth/google";

const config: GoogleAuthConfig = {
  clientId: "your-client-id",
  redirectUri: "https://yourapp.com/auth/callback",
  apiBaseUrl: "https://api.yourapp.com",
  scope: "openid email profile",
  storageKey: "myAppUser",
};

function App() {
  return (
    <GoogleAuthProvider config={config}>
      <YourApp />
    </GoogleAuthProvider>
  );
}
```

## API Reference

### Types

#### `GoogleOAuthProfile`

User profile returned from Google's userinfo endpoint:

```typescript
interface GoogleOAuthProfile {
  sub: string; // Google user ID
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}
```

#### `GoogleAuthConfig`

Configuration for OAuth client:

```typescript
interface GoogleAuthConfig {
  clientId: string;
  redirectUri: string;
  apiBaseUrl?: string;
  scope?: string;
  storageKey?: string;
}
```

### Default Client Functions

#### `initiateGoogleLogin()`

Initiates OAuth flow with default configuration. Reads from
`VITE_GOOGLE_CLIENT_ID` and `VITE_REDIRECT_URI`.

#### `handleGoogleCallback(code: string): Promise<GoogleOAuthProfile>`

Handles OAuth callback by calling backend endpoint. Calls
`POST /api/auth/google/callback` by default.

### Components

#### `DefaultGoogleAuthProvider`

Auth provider with sensible defaults:

- Storage key: `"user"`
- API endpoint: `/api/auth/google/callback` (auto-detected)

#### `GoogleAuthProvider`

Configurable auth provider with full control over all parameters.

#### `useGoogleAuth()`

Hook to access auth context:

```typescript
const { user, loading, signInWithGoogle, signOut, updateUser } =
  useGoogleAuth();
```

#### `DefaultGoogleAuthCallback`

Callback component with sensible defaults for common flow.

#### `GoogleAuthCallback`

Configurable callback component for custom flows.

## Backend Implementation

### API Contract

**Endpoint:** `POST /api/auth/google/callback`

**Request:**

```json
{
  "code": "authorization_code_from_google"
}
```

**Response:**

```json
{
  "user": {
    "sub": "google_user_id",
    "name": "User Name",
    "email": "user@example.com",
    "picture": "https://...",
    "email_verified": true
  }
}
```

### Minimal Deno Implementation

Here's a complete example for Deno:

```typescript
/// <reference lib="deno.unstable" />

interface GoogleTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  id_token?: string;
}

interface GoogleUserInfo {
  sub: string;
  name: string;
  email: string;
  picture?: string;
  email_verified?: boolean;
}

/**
 * Handles Google OAuth callback
 * POST /api/auth/google/callback
 */
export async function googleAuthHandler(req: Request): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    // Parse request body
    const { code } = await req.json();
    if (!code) {
      return new Response(
        JSON.stringify({ error: "Authorization code is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Get environment variables
    const clientId = Deno.env.get("GOOGLE_CLIENT_ID");
    const clientSecret = Deno.env.get("GOOGLE_CLIENT_SECRET");
    const redirectUri = Deno.env.get("GOOGLE_REDIRECT_URI") ||
      "http://localhost:5173/auth/callback";

    if (!clientId || !clientSecret) {
      return new Response(
        JSON.stringify({ error: "OAuth configuration missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Exchange authorization code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const error = await tokenResponse.json();
      return new Response(
        JSON.stringify({
          error: error.error_description ||
            error.error ||
            "Failed to exchange code for token",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json();

    if (!tokens.access_token) {
      return new Response(
        JSON.stringify({ error: "No access token received" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Fetch user info from Google
    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      },
    );

    if (!userResponse.ok) {
      const error = await userResponse.json();
      return new Response(
        JSON.stringify({
          error: error.error_description ||
            error.error ||
            "Failed to fetch user info",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    const userInfo: GoogleUserInfo = await userResponse.json();

    // Return user profile
    return new Response(JSON.stringify({ user: userInfo }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("OAuth error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
```

### Adding to Your Server

In your Deno server routing:

```typescript
// In your main server file (e.g., serve_deno_deploy.ts)
import { googleAuthHandler } from "./auth.ts";

async function routeRequest(
  req: Request,
  kv: Deno.Kv,
  config: ServerConfig,
): Promise<Response> {
  const url = new URL(req.url);

  // Handle Google OAuth callback
  if (url.pathname === "/api/auth/google/callback") {
    return googleAuthHandler(req);
  }

  // ... other routes
}
```

### Environment Variables

Add to your server environment:

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback
```

## Security Notes

1. **Never expose client secret in frontend code** - Always exchange tokens
   server-side
2. **Use HTTPS in production** - OAuth requires secure connections
3. **Validate redirect URIs** - Ensure redirect URIs match your Google OAuth app
   configuration
4. **Store tokens securely** - If storing refresh tokens, use secure server-side
   storage

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Configure:
   - Application type: Web application
   - Authorized redirect URIs: `http://localhost:5173/auth/callback` (dev) and
     your production URL
6. Copy Client ID and Client Secret

## Troubleshooting

### "Failed to exchange code for token"

- Check that `GOOGLE_CLIENT_SECRET` is set correctly on the server
- Verify redirect URI matches exactly (including trailing slashes)
- Ensure the authorization code hasn't expired (codes expire quickly)

### "No authorization code received"

- Check that the callback URL is configured correctly in Google Cloud Console
- Verify the redirect URI in your frontend matches the one in Google Cloud
  Console

### CORS errors

- Ensure your backend allows requests from your frontend origin
- Check that the API endpoint is correctly configured

## Examples

A demo that uses this package is available in this repo: run `npm run dev` from
the stack package root and see the component showcase.
