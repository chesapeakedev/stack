// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";
import { Button } from "../ui/button.tsx";
import { Textarea } from "../ui/textarea.tsx";
import { Label } from "../ui/label.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer.tsx";
import { toast } from "../ui/sonner-api.ts";

interface FeedbackDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (feedback: string) => Promise<void>;
}

export function FeedbackDrawer({
  isOpen,
  onClose,
  onSubmit,
}: FeedbackDrawerProps) {
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!feedback.trim() || feedback.trim().length < 10) return;

    setIsSubmitting(true);
    try {
      await onSubmit(feedback.trim());
      setFeedback("");
      toast("Feedback Submitted", {
        description: "Thank you for your feedback! We appreciate your input.",
      });
      onClose();
    } catch (error) {
      console.error("Failed to submit feedback:", error);
      toast.error("Failed to Submit Feedback", {
        description:
          "There was an error submitting your feedback. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFeedback("");
      onClose();
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Send Feedback
            </DrawerTitle>
            <DrawerDescription>
              Help us improve by sharing your thoughts and suggestions
            </DrawerDescription>
          </DrawerHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSubmit(e);
            }}
            className="p-4 pb-0 space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="feedback">Your Feedback</Label>
              <Textarea
                id="feedback"
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                }}
                placeholder="Tell us what you think, what features you'd like to see, or report any issues..."
                rows={6}
                className="resize-none"
                disabled={isSubmitting}
                maxLength={1000}
                required
              />
              <p className="text-xs text-muted-foreground">
                {feedback.length}/1000 characters (minimum 10 characters)
              </p>
            </div>
            <DrawerFooter>
              <div className="flex gap-2">
                <DrawerClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
                <Button
                  type="submit"
                  disabled={
                    !feedback.trim() ||
                    feedback.trim().length < 10 ||
                    isSubmitting
                  }
                  className="flex-1"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Send Feedback
                    </>
                  )}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
