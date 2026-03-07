/**
 * Authentication setup with Google and GitHub providers.
 *
 * Demonstrates: MultiAuthProvider, AuthSelector, useAuth, ThemeProvider
 *
 * Requires environment variables:
 *   VITE_GOOGLE_CLIENT_ID - Google OAuth client ID
 *   VITE_GITHUB_CLIENT_ID - GitHub OAuth client ID
 *   VITE_API_BASE_URL     - Backend API base URL (e.g. http://localhost:3000)
 */

import { ThemeProvider } from "@chesapeake/stack/components/ux/theme-provider";
import { MultiAuthProvider } from "@chesapeake/stack/components/ux/auth/MultiAuthProvider";
import { AuthSelector } from "@chesapeake/stack/components/ux/auth/AuthSelector";
import { useAuth } from "@chesapeake/stack/components/ux/auth/useAuth";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@chesapeake/stack/components/ui/avatar";
import { Button } from "@chesapeake/stack/components/ui/button";

function AuthStatus() {
  const { user, signOut } = useAuth();

  if (!user) {
    return (
      <div className="max-w-sm mx-auto mt-12 space-y-4 text-center">
        <h2 className="text-xl font-semibold">Sign In</h2>
        <p className="text-muted-foreground">
          Choose a provider to get started.
        </p>
        <AuthSelector enableGoogle enableGithub />
      </div>
    );
  }

  const displayName =
    typeof user.displayName === "string" ? user.displayName : "";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("");
  const email = typeof user.email === "string" ? user.email : undefined;
  const profilePicture =
    typeof user.profilePicture === "string" ? user.profilePicture : undefined;

  return (
    <div className="max-w-sm mx-auto mt-12 space-y-4 text-center">
      <Avatar className="h-16 w-16 mx-auto">
        <AvatarImage src={profilePicture} alt={displayName} />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      <h2 className="text-xl font-semibold">{displayName}</h2>
      {email && <p className="text-sm text-muted-foreground">{email}</p>}
      <Button variant="outline" onClick={signOut}>
        Sign Out
      </Button>
    </div>
  );
}

export function AuthSetupExample() {
  return (
    <ThemeProvider>
      <MultiAuthProvider
        providers={[
          { provider: "google", enabled: true },
          { provider: "github", enabled: true },
        ]}
        onUserUpdate={(user) => {
          console.log("Auth user updated:", user);
        }}
      >
        <AuthStatus />
      </MultiAuthProvider>
    </ThemeProvider>
  );
}
