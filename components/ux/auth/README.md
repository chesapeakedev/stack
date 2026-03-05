# Multi-Provider Authentication

This package provides a unified authentication system that supports multiple
OAuth providers (Google, GitHub) with a single interface. Apps can configure
which providers are available, and users can choose which provider to use.

## Features

- 🔐 Support for multiple OAuth providers (Google, GitHub)
- 🎛️ Configure which providers are enabled per app
- 🎨 Unified `AuthSelector` component for provider selection
- 🔄 Single user identity at a time (one provider active)
- ⚙️ Both configurable and default client options
- 📦 TypeScript types for type safety

## Installation

This package is part of the `@chesapeake/shared-components` package. Import
from:

```typescript
import { ... } from "@shared/components/ux/auth";
```

## Quick Start

### 1. Setup MultiAuthProvider

Wrap your app with `MultiAuthProvider` and configure which providers are
enabled:

```tsx
import {
  type AuthProviderConfig,
  MultiAuthProvider,
} from "@shared/components/ux/auth";

function App() {
  // Configure which providers are available
  const authProviders: AuthProviderConfig[] = [
    { provider: "github", enabled: true },
    { provider: "google", enabled: true }, // Enable both
  ];

  return (
    <MultiAuthProvider providers={authProviders}>
      <YourApp />
    </MultiAuthProvider>
  );
}
```

### 2. Use AuthSelector Component

The `AuthSelector` component provides buttons for enabled providers:

```tsx
import { AuthSelector } from "@shared/components/ux/auth";

function LoginPage() {
  return (
    <AuthSelector
      enableGithub={true}
      enableGoogle={true}
      onAuthSuccess={(user, provider) => {
        console.log(`User authenticated with ${provider}:`, user);
      }}
    />
  );
}
```

### 3. Use Auth Hook

Access auth state and methods with the unified `useAuth` hook:

```tsx
import { useAuth } from "@shared/components/ux/auth";

function UserProfile() {
  const { user, loading, provider, signOut } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;

  return (
    <div>
      <p>Signed in with {provider}</p>
      <button onClick={signOut}>Sign Out</button>
    </div>
  );
}
```

## Configuration Examples

### Single Provider (GitHub only)

```tsx
const authProviders: AuthProviderConfig[] = [
  { provider: "github", enabled: true },
  { provider: "google", enabled: false },
];

<MultiAuthProvider providers={authProviders}>
  <AuthSelector enableGithub={true} enableGoogle={false} />
</MultiAuthProvider>;
```

### Single Provider (Google only)

```tsx
const authProviders: AuthProviderConfig[] = [
  { provider: "google", enabled: true },
  { provider: "github", enabled: false },
];

<MultiAuthProvider providers={authProviders}>
  <AuthSelector enableGoogle={true} enableGithub={false} />
</MultiAuthProvider>;
```

### Custom Configuration

You can provide custom configuration for each provider:

```tsx
const authProviders: AuthProviderConfig[] = [
  {
    provider: "github",
    enabled: true,
    config: {
      clientId: "your-github-client-id",
      redirectUri: "http://localhost:5173/auth/callback",
      backendInitEndpoint: "/api/auth/github", // Optional: if backend handles OAuth
    },
  },
  {
    provider: "google",
    enabled: true,
    config: {
      clientId: "your-google-client-id",
      redirectUri: "http://localhost:5173/auth/callback",
      scope: "openid email profile",
    },
  },
];
```

### Using Default Clients

If you don't provide config, the providers will use default clients that read
from environment variables:

```tsx
// Uses VITE_GITHUB_CLIENT_ID or VITE_GITHUB_BACKEND_INIT_ENDPOINT
const authProviders: AuthProviderConfig[] = [
  { provider: "github", enabled: true }, // Uses default client
  { provider: "google", enabled: true }, // Uses VITE_GOOGLE_CLIENT_ID
];
```

## AuthSelector Component

The `AuthSelector` component provides a ready-to-use UI for authentication:

### Props

```typescript
interface AuthSelectorProps {
  /** Enable Google OAuth provider */
  enableGoogle?: boolean;
  /** Enable GitHub OAuth provider */
  enableGithub?: boolean;
  /** Custom styling/className */
  className?: string;
  /** Callback when user successfully authenticates */
  onAuthSuccess?: (user: AuthUser, provider: "google" | "github") => void;
  /** Custom button components (optional) */
  googleButton?: React.ReactNode;
  githubButton?: React.ReactNode;
}
```

### Behavior

- Renders buttons for enabled providers
- Buttons are disabled when user is already authenticated
- Shows current authenticated provider state
- Provides sign out button when authenticated
- Only one provider can be active at a time

## useAuth Hook

The unified `useAuth` hook provides access to auth state and methods:

```typescript
interface MultiAuthContextType {
  user: AuthUser | null;
  loading: boolean;
  provider: "google" | "github" | null;
  signInWithGoogle: () => void;
  signInWithGitHub: () => void;
  signOut: () => void;
  updateUser: (user: AuthUser | null) => void;
}
```

## Backend Integration

### Backend-Handled OAuth Flow

If your backend handles the entire OAuth flow (common for server-side session
management), configure providers with `backendInitEndpoint`:

```tsx
const authProviders: AuthProviderConfig[] = [
  {
    provider: "github",
    enabled: true,
    config: {
      backendInitEndpoint: "/api/auth/github", // Backend handles OAuth initiation
      redirectUri: window.location.origin + "/api/auth/github/callback",
    },
  },
];
```

The frontend will redirect to the backend endpoint, which then redirects to the
OAuth provider. After successful authentication, the backend should redirect
back to your app, and the frontend will sync with the backend session.

### Frontend-Handled OAuth Flow

If your frontend initiates OAuth and backend only handles the callback:

```tsx
const authProviders: AuthProviderConfig[] = [
  {
    provider: "github",
    enabled: true,
    config: {
      clientId: "your-github-client-id",
      redirectUri: "http://localhost:5173/auth/callback",
      apiBaseUrl: "", // Backend API base URL
    },
  },
];
```

## Individual Provider Documentation

- [Google Auth](./google/README.md) - Google OAuth setup and usage
- [GitHub Auth](./github/README.md) - GitHub OAuth setup and usage

## Type Safety

All components and hooks are fully typed with TypeScript:

```typescript
import type {
  AuthProviderConfig,
  AuthSelectorProps,
  AuthUser,
  MultiAuthContextType,
  MultiAuthProviderProps,
} from "@shared/components/ux/auth";
```

## Examples

### Complete Example: Todo App with GitHub Auth

```tsx
import {
  AuthSelector,
  MultiAuthProvider,
  useAuth,
} from "@shared/components/ux/auth";

function App() {
  const authProviders: AuthProviderConfig[] = [
    {
      provider: "github",
      enabled: true,
      config: {
        backendInitEndpoint: "/api/auth/github",
        redirectUri: window.location.origin + "/api/auth/github/callback",
      },
    },
    { provider: "google", enabled: false },
  ];

  return (
    <MultiAuthProvider providers={authProviders}>
      <TodoApp />
    </MultiAuthProvider>
  );
}

function ProfilePage() {
  const { user, signOut } = useAuth();

  return (
    <div>
      {user
        ? (
          <div>
            <p>Signed in as {user.login || user.email}</p>
            <button onClick={signOut}>Sign Out</button>
          </div>
        )
        : <AuthSelector enableGithub={true} enableGoogle={false} />}
    </div>
  );
}
```
