// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */

import { Search } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button.tsx";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "../ui/drawer.tsx";
import { Input } from "../ui/input.tsx";

/**
 * Media format information from Tenor API
 */
interface TenorMediaFormat {
  /** URL of the media file */
  url: string;
  /** Dimensions of the media [width, height] */
  dims: number[];
  /** File size in bytes */
  size: number;
}

/**
 * Individual GIF result from Tenor API
 */
interface TenorResult {
  /** Unique identifier for the GIF */
  id: string;
  /** Title or description of the GIF */
  title: string;
  /** Available media formats for this GIF */
  media_formats: {
    /** Standard GIF format */
    gif?: TenorMediaFormat;
    /** Small/optimized GIF for previews */
    tinygif?: TenorMediaFormat;
    /** MP4 video format */
    mp4?: TenorMediaFormat;
    /** Small MP4 for previews */
    tinymp4?: TenorMediaFormat;
  };
}

/**
 * Response structure from Tenor search API
 */
interface TenorSearchResponse {
  /** Array of search results */
  results: TenorResult[];
  /** Token for fetching next page of results */
  next: string;
}

/**
 * Props for the GifSearch component
 */
interface GifSearchProps {
  /** Controls whether the search drawer is open */
  isOpen: boolean;
  /** Callback when the drawer should be closed */
  onClose: () => void;
  /** Callback when a GIF is selected, receives the GIF URL */
  onSelectGif: (gifUrl: string) => void;
  /**
   * Tenor API key for searching GIFs.
   * Obtain from https://developers.google.com/tenor/guides/quickstart
   */
  apiKey: string;
  /**
   * Client key for Tenor API analytics.
   * Used to track which application is making requests.
   * Defaults to your app's name or identifier.
   */
  clientKey?: string;
}

/**
 * A drawer component for searching and selecting GIFs using the Tenor API.
 *
 * This component provides a UI for searching GIFs and selecting one from the results.
 * It requires a Tenor API key which can be obtained from Google Cloud Console.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const [isOpen, setIsOpen] = useState(false);
 *   const [selectedGif, setSelectedGif] = useState<string | null>(null);
 *
 *   return (
 *     <>
 *       <Button onClick={() => setIsOpen(true)}>Search GIFs</Button>
 *       <GifSearch
 *         isOpen={isOpen}
 *         onClose={() => setIsOpen(false)}
 *         onSelectGif={(url) => {
 *           setSelectedGif(url);
 *           setIsOpen(false);
 *         }}
 *         apiKey={process.env.VITE_TENOR_API_KEY}
 *       />
 *     </>
 *   );
 * }
 * ```
 */
export function GifSearch({
  isOpen,
  onClose,
  onSelectGif,
  apiKey,
  clientKey = "stack",
}: GifSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [gifResults, setGifResults] = useState<string[]>([]);

  const handleSearch = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        q: searchQuery,
        key: apiKey,
        client_key: clientKey,
        limit: "8",
        media_filter: "gif,tinygif,mp4,tinymp4",
        contentfilter: "medium",
      });

      const response = await fetch(
        `https://tenor.googleapis.com/v2/search?${params}`
      );

      if (!response.ok) {
        throw new Error(`Tenor API error: ${String(response.status)}`);
      }

      const data = (await response.json()) as TenorSearchResponse;

      if (Array.isArray(data.results)) {
        const gifUrls = data.results
          .map((result: TenorResult) => {
            // Prefer tinygif for preview, fallback to gif
            const mediaFormats = result.media_formats;
            return (
              mediaFormats.tinygif?.url ??
              mediaFormats.gif?.url ??
              mediaFormats.mp4?.url
            );
          })
          .filter((url): url is string => url !== undefined);

        setGifResults(gifUrls);
      } else {
        setGifResults([]);
      }
    } catch (error) {
      console.error("Error searching GIFs:", error);
      setGifResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGifSelect = (gifUrl: string) => {
    onSelectGif(gifUrl);
    onClose();
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle>Search GIFs</DrawerTitle>
            <DrawerDescription>
              Find the perfect GIF to express yourself in the chat.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4 pb-0">
            {/* Search Form */}
            <form
              onSubmit={(e: React.SyntheticEvent<HTMLFormElement>) => {
                void handleSearch(e);
              }}
              className="flex gap-2 mb-4"
            >
              <Input
                value={searchQuery}
                onChange={(e) => {
                  const value = (e.target as unknown as { value: string })
                    .value;
                  setSearchQuery(value);
                }}
                placeholder="Search for GIFs..."
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Results */}
            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">Searching...</div>
                </div>
              ) : gifResults.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {gifResults.map((gifUrl, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border"
                      onClick={() => {
                        handleGifSelect(gifUrl);
                      }}
                    >
                      <img
                        src={gifUrl}
                        alt={`GIF ${String(index + 1)}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground">No GIFs found</div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-32">
                  <div className="text-muted-foreground text-center">
                    Search for GIFs to get started
                  </div>
                </div>
              )}
            </div>
          </div>

          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
