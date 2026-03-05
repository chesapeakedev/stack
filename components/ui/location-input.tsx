// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

import * as React from "react";
import { cn } from "../../lib/utils.ts";

export interface LocationSuggestion {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

// Google Maps Places API types (inlined; use @types/google.maps in your project if available)
type GoogleMapsWindow = Window & {
  google?: {
    maps?: {
      places?: {
        AutocompleteService: new () => AutocompleteService;
      };
    };
  };
};

interface AutocompleteRequest {
  input: string;
  types?: string[];
}

interface AutocompletePrediction {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
}

type AutocompleteStatus =
  | "OK"
  | "ZERO_RESULTS"
  | "OVER_QUERY_LIMIT"
  | "REQUEST_DENIED"
  | "INVALID_REQUEST"
  | "UNKNOWN_ERROR";

type AutocompleteCallback = (
  predictions: AutocompletePrediction[] | null,
  status: AutocompleteStatus
) => void;

interface AutocompleteService {
  getPlacePredictions(
    request: AutocompleteRequest,
    callback: AutocompleteCallback
  ): void;
}

export interface LocationInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  onLocationSelect?: (location: LocationSuggestion) => void;
  onInputChange?: (value: string) => void;
  onSearchClose?: () => void;
  placeholder?: string;
  className?: string;
  suggestionsClassName?: string;
  apiKey?: string;
  debounceMs?: number;
}

const LocationInput = React.forwardRef<HTMLInputElement, LocationInputProps>(
  (
    {
      className,
      onLocationSelect,
      onInputChange,
      onSearchClose,
      placeholder,
      suggestionsClassName,
      apiKey,
      debounceMs,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const [suggestions, setSuggestions] = React.useState<LocationSuggestion[]>(
      []
    );
    const [isLoading, setIsLoading] = React.useState(false);
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const inputRef = React.useRef<HTMLInputElement>(null);
    const suggestionsRef = React.useRef<HTMLDivElement>(null);
    const debounceTimeoutRef = React.useRef<
      ReturnType<typeof setTimeout> | undefined
    >(undefined);

    // Initialize Google Maps Autocomplete service
    const [autocompleteService, setAutocompleteService] =
      React.useState<AutocompleteService | null>(null);

    React.useEffect(() => {
      // Load Google Maps JavaScript API
      if (typeof window === "undefined") {
        return;
      }
      const win = window as unknown as GoogleMapsWindow;
      if (win.google?.maps?.places) {
        setAutocompleteService(
          new win.google.maps.places.AutocompleteService()
        );
      } else if (apiKey) {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        script.onload = () => {
          const winAfterLoad = window as unknown as GoogleMapsWindow;
          if (winAfterLoad.google?.maps?.places) {
            setAutocompleteService(
              new winAfterLoad.google.maps.places.AutocompleteService()
            );
          }
        };
        document.head.appendChild(script);
      }
    }, [apiKey]);

    // Debounced search function
    const searchLocations = React.useCallback(
      (query: string) => {
        if (!query.trim() || !autocompleteService) {
          setSuggestions([]);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        try {
          const request: AutocompleteRequest = {
            input: query,
            types: ["establishment", "geocode"],
          };

          const callback: AutocompleteCallback = (predictions, status) => {
            setIsLoading(false);
            if (status === "OK" && predictions) {
              const formattedSuggestions: LocationSuggestion[] =
                predictions.map((prediction) => ({
                  place_id: prediction.place_id,
                  description: prediction.description,
                  structured_formatting: {
                    main_text:
                      prediction.structured_formatting?.main_text ?? "",
                    secondary_text:
                      prediction.structured_formatting?.secondary_text ?? "",
                  },
                }));
              setSuggestions(formattedSuggestions);
            } else {
              setSuggestions([]);
            }
          };

          autocompleteService.getPlacePredictions(request, callback);
        } catch (error) {
          console.error("Error fetching location suggestions:", error);
          setIsLoading(false);
          setSuggestions([]);
        }
      },
      [autocompleteService]
    );

    // Handle input change with debouncing
    const handleInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        onInputChange?.(value);
        setSelectedIndex(-1);

        // Clear previous timeout
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }

        // Set new timeout for debounced search
        debounceTimeoutRef.current = setTimeout(() => {
          searchLocations(value);
        }, debounceMs ?? 300);
      },
      [onInputChange, searchLocations, debounceMs]
    );

    // Handle suggestion selection
    const handleSuggestionClick = React.useCallback(
      (suggestion: LocationSuggestion) => {
        setInputValue(suggestion.description);
        setSuggestions([]);
        setShowSuggestions(false);
        setSelectedIndex(-1);
        onLocationSelect?.(suggestion);
        onInputChange?.(suggestion.description);
      },
      [onLocationSelect, onInputChange]
    );

    // Handle close button click
    const handleCloseClick = React.useCallback(() => {
      setSuggestions([]);
      setShowSuggestions(false);
      setSelectedIndex(-1);
      onSearchClose?.();
    }, [onSearchClose]);

    // Handle keyboard navigation
    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showSuggestions || suggestions.length === 0) return;

        switch (e.key) {
          case "ArrowDown":
            e.preventDefault();
            setSelectedIndex((prev) =>
              prev < suggestions.length - 1 ? prev + 1 : prev
            );
            break;
          case "ArrowUp":
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
            break;
          case "Enter":
            e.preventDefault();
            if (selectedIndex >= 0 && suggestions[selectedIndex]) {
              handleSuggestionClick(suggestions[selectedIndex]);
            }
            break;
          case "Escape":
            setShowSuggestions(false);
            setSelectedIndex(-1);
            break;
        }
      },
      [showSuggestions, suggestions, selectedIndex, handleSuggestionClick]
    );

    // Handle focus/blur
    const handleFocus = React.useCallback(() => {
      if (suggestions.length > 0) {
        setShowSuggestions(true);
      }
    }, [suggestions.length]);

    const handleBlur = React.useCallback(() => {
      // Delay hiding suggestions to allow for clicks
      setTimeout(() => {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }, 200);
    }, []);

    // Show suggestions when they arrive
    React.useEffect(() => {
      if (
        suggestions.length > 0 &&
        document.activeElement === inputRef.current
      ) {
        setShowSuggestions(true);
      }
    }, [suggestions.length]);

    // Scroll selected suggestion into view
    React.useEffect(() => {
      if (
        selectedIndex >= 0 &&
        suggestionsRef.current &&
        selectedIndex < suggestionsRef.current.children.length
      ) {
        const selectedElement = suggestionsRef.current.children[
          selectedIndex
        ] as HTMLElement | null;
        if (selectedElement) {
          selectedElement.scrollIntoView({ block: "nearest" });
        }
      }
    }, [selectedIndex]);

    // Cleanup timeout on unmount
    React.useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    return (
      <div className={cn("relative", className)}>
        <input
          ref={(node) => {
            // Handle both refs
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />

        {/* Close button - only visible when suggestions are shown */}
        {showSuggestions && suggestions.length > 0 && (
          <button
            type="button"
            onClick={handleCloseClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors z-10"
            aria-label="Close location search"
          >
            ✕
          </button>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          </div>
        )}

        {/* Suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div
            ref={suggestionsRef}
            className={cn(
              "absolute z-50 w-full mt-1 bg-popover border border-border rounded-md shadow-lg max-h-60 overflow-auto",
              suggestionsClassName
            )}
          >
            {suggestions.map((suggestion, index) => (
              <div
                key={suggestion.place_id}
                className={cn(
                  "px-3 py-2 text-sm cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors",
                  selectedIndex === index && "bg-accent text-accent-foreground"
                )}
                onClick={() => {
                  handleSuggestionClick(suggestion);
                }}
              >
                <div className="font-medium">
                  {suggestion.structured_formatting.main_text}
                </div>
                {suggestion.structured_formatting.secondary_text && (
                  <div className="text-xs text-muted-foreground">
                    {suggestion.structured_formatting.secondary_text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

LocationInput.displayName = "LocationInput";

export { LocationInput };
