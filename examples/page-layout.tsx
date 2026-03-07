/**
 * App shell using StandardLayout and PageLayout primitives.
 *
 * Demonstrates: StandardLayout, PageLayout, PageHeader, PageContent, PageContainer
 *
 * StandardLayout provides a header with an optional profile button and
 * integrated auth. PageLayout/PageHeader/PageContent are lower-level
 * primitives for building individual page views.
 */

import { ThemeProvider } from "@chesapeake/stack/components/ux/theme-provider";
import { MultiAuthProvider } from "@chesapeake/stack/components/ux/auth/MultiAuthProvider";
import { StandardLayout } from "@chesapeake/stack/components/ux/StandardLayout";
import {
  PageLayout,
  PageHeader,
  PageContent,
  PageContainer,
} from "@chesapeake/stack/components/ux/StandardLayout/PageLayout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@chesapeake/stack/components/ui/card";
import { Button } from "@chesapeake/stack/components/ui/button";

function DashboardPage() {
  return (
    <PageLayout>
      <PageHeader>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <Button>New Project</Button>
        </div>
      </PageHeader>
      <PageContent>
        <PageContainer maxWidth="xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">12</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">48</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Team</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">6</p>
              </CardContent>
            </Card>
          </div>
        </PageContainer>
      </PageContent>
    </PageLayout>
  );
}

/**
 * Full app shell: wrap with StandardLayout for the header + profile button,
 * or use the PageLayout primitives directly for custom layouts.
 */
export function PageLayoutExample() {
  return (
    <ThemeProvider>
      <MultiAuthProvider
        providers={[
          { provider: "google", enabled: true },
          { provider: "github", enabled: true },
        ]}
      >
        <StandardLayout
          showProfileButton
          enableGoogle
          enableGithub
          maxWidth="wide"
          headerContent={<span className="text-lg font-semibold">My App</span>}
        >
          <DashboardPage />
        </StandardLayout>
      </MultiAuthProvider>
    </ThemeProvider>
  );
}
