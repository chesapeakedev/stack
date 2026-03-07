/**
 * Notifications, feedback collection, and dialogs.
 *
 * Demonstrates: FeedbackDrawer, toast (sonner), Dialog, Button
 */

import { useState } from "react";
import { ThemeProvider } from "@chesapeake/stack/components/ux/theme-provider";
import { FeedbackDrawer } from "@chesapeake/stack/components/ux/FeedbackDrawer";
import { Toaster } from "@chesapeake/stack/components/ui/sonner";
import { toast } from "@chesapeake/stack/components/ui/sonner-api";
import { Button } from "@chesapeake/stack/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chesapeake/stack/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@chesapeake/stack/components/ui/dialog";

function NotificationsDemo() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-8">
      {/* Toast notifications */}
      <Card>
        <CardHeader>
          <CardTitle>Toast Notifications</CardTitle>
          <CardDescription>
            Trigger different toast styles with the sonner API.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => toast("Event created successfully.")}
          >
            Default Toast
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.success("Profile saved", {
                description: "Your changes are live.",
              })
            }
          >
            Success
          </Button>
          <Button
            variant="outline"
            onClick={() => toast.error("Something went wrong.")}
          >
            Error
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast.promise(
                new Promise((resolve) => setTimeout(resolve, 2000)),
                {
                  loading: "Saving...",
                  success: "Saved!",
                  error: "Failed to save.",
                }
              )
            }
          >
            Promise
          </Button>
        </CardContent>
      </Card>

      {/* Confirmation dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Confirmation Dialog</CardTitle>
          <CardDescription>
            Modal dialog for destructive or important actions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. Your account and all associated
                  data will be permanently deleted.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button
                  variant="destructive"
                  onClick={() => toast.error("Account deleted (demo)")}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Feedback drawer */}
      <Card>
        <CardHeader>
          <CardTitle>Feedback Drawer</CardTitle>
          <CardDescription>
            Slide-up drawer for collecting user feedback.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            onClick={() => {
              setFeedbackOpen(true);
            }}
          >
            Send Feedback
          </Button>
          <FeedbackDrawer
            isOpen={feedbackOpen}
            onClose={() => {
              setFeedbackOpen(false);
            }}
            onSubmit={(feedback) => {
              console.log("Feedback received:", feedback);
              return Promise.resolve();
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export function FeedbackAndNotificationsExample() {
  return (
    <ThemeProvider>
      <NotificationsDemo />
      <Toaster />
    </ThemeProvider>
  );
}
