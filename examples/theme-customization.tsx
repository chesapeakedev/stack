/**
 * Theme customization with ThemeProvider and useTheme.
 *
 * Demonstrates: ThemeProvider, useTheme, dark/light toggle, themed components
 *
 * To customize design tokens, override CSS variables in your app's CSS file
 * _after_ importing the stack styles. See the accompanying
 * theme-customization.css for an example of overriding colors and fonts.
 */

import { ThemeProvider } from "@chesapeake/stack/components/ux/theme-provider";
import { useTheme } from "@chesapeake/stack/components/ux/useTheme";
import { Button } from "@chesapeake/stack/components/ui/button";
import { Badge } from "@chesapeake/stack/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chesapeake/stack/components/ui/card";
import { Separator } from "@chesapeake/stack/components/ui/separator";
import { Moon, Sun, Monitor } from "lucide-react";

type Theme = "light" | "dark" | "system";

function ThemeDemo() {
  const { theme, setTheme } = useTheme();

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="h-4 w-4" /> },
    {
      value: "system",
      label: "System",
      icon: <Monitor className="h-4 w-4" />,
    },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-8">
      <Card>
        <CardHeader>
          <CardTitle>Theme Switcher</CardTitle>
          <CardDescription>
            Current theme: <Badge variant="outline">{theme}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex gap-2">
          {themes.map(({ value, label, icon }) => (
            <Button
              key={value}
              variant={theme === value ? "default" : "outline"}
              onClick={() => {
                setTheme(value);
              }}
            >
              {icon}
              <span className="ml-2">{label}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      <Separator />

      <Card>
        <CardHeader>
          <CardTitle>Color Tokens</CardTitle>
          <CardDescription>
            These swatches reflect your current theme variables.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {[
              {
                name: "primary",
                bg: "bg-primary",
                fg: "text-primary-foreground",
              },
              {
                name: "secondary",
                bg: "bg-secondary",
                fg: "text-secondary-foreground",
              },
              { name: "accent", bg: "bg-accent", fg: "text-accent-foreground" },
              { name: "muted", bg: "bg-muted", fg: "text-muted-foreground" },
              {
                name: "destructive",
                bg: "bg-destructive",
                fg: "text-destructive-foreground",
              },
              { name: "card", bg: "bg-card", fg: "text-card-foreground" },
              {
                name: "popover",
                bg: "bg-popover",
                fg: "text-popover-foreground",
              },
              {
                name: "background",
                bg: "bg-background",
                fg: "text-foreground",
              },
            ].map(({ name, bg, fg }) => (
              <div
                key={name}
                className={`${bg} ${fg} rounded-md p-3 text-xs font-medium text-center border`}
              >
                {name}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function ThemeCustomizationExample() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="example-theme">
      <ThemeDemo />
    </ThemeProvider>
  );
}
