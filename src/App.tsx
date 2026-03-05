/** @jsxImportSource react */
import { useState } from "react";
import { ThemeProvider } from "@chesapeake/stack/components/ux/theme-provider";
import { useTheme } from "@chesapeake/stack/components/ux/useTheme";
import { Button } from "@chesapeake/stack/components/ui/button";
import { Input } from "@chesapeake/stack/components/ui/input";
import { Label } from "@chesapeake/stack/components/ui/label";
import { Textarea } from "@chesapeake/stack/components/ui/textarea";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@chesapeake/stack/components/ui/avatar";
import { Calendar } from "@chesapeake/stack/components/ui/calendar";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@chesapeake/stack/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@chesapeake/stack/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@chesapeake/stack/components/ui/popover";
import { Toaster } from "@chesapeake/stack/components/ui/sonner";
import { toast as toastFn } from "@chesapeake/stack/components/ui/sonner-api";

/** Typed toast helper for message + description to satisfy strict ESLint. */
function toast(message: string, options?: { description?: string }): void {
  const show = toastFn as (
    msg: string,
    opts?: { description?: string }
  ) => void;
  show(message, options);
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@chesapeake/stack/components/ui/card";
import { GifSearch } from "@chesapeake/stack/components/ux/GifSearch";
import { ImageUpload } from "@chesapeake/stack/components/ux/ImageUpload";
import { TutorialCarousel } from "@chesapeake/stack/components/ux/TutorialCarousel";
import { LocationInput } from "@chesapeake/stack/components/ui/location-input";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  LogOut,
  MapPin,
  Moon,
  Search,
  Settings,
  Sun,
  User,
} from "lucide-react";

function ComponentShowcase() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [gifSearchOpen, setGifSearchOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const { theme, setTheme } = useTheme();

  const handleToast = () => {
    toast("Hello!", {
      description: "This is a toast notification from the shared components.",
    });
  };

  const handleGifSelect = (gifUrl: string) => {
    console.log("Selected GIF:", gifUrl);
    toast("GIF Selected", {
      description: "You selected a GIF!",
    });
  };

  const tutorialSlides = [
    {
      id: 1,
      title: "Welcome to the Component Showcase",
      description:
        "This is a demonstration of all shared components in the Chesapeake design system.",
      icon: Settings,
      color: "blue",
    },
    {
      id: 2,
      title: "UI Components",
      description: "Explore the various UI components available.",
      icon: User,
      color: "green",
    },
    {
      id: 3,
      title: "UX Components",
      description: "See the more complex UX components in action.",
      icon: CalendarIcon,
      color: "purple",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8 pb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Component Showcase</h1>
              <p className="text-muted-foreground">
                A comprehensive demonstration of all shared components in the
                Chesapeake design system
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTheme("light");
                }}
                className={theme === "light" ? "bg-accent" : ""}
              >
                <Sun className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTheme("dark");
                }}
                className={theme === "dark" ? "bg-accent" : ""}
              >
                <Moon className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Theme Provider Section */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Theme Provider</CardTitle>
            <CardDescription>
              Toggle between light and dark themes using the theme provider.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTheme("light");
                }}
                className={theme === "light" ? "bg-accent" : ""}
              >
                <Sun className="h-4 w-4 mr-2" />
                Light
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setTheme("dark");
                }}
                className={theme === "dark" ? "bg-accent" : ""}
              >
                <Moon className="h-4 w-4 mr-2" />
                Dark
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* 3-column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Card 1: Buttons */}
          <Card>
            <CardHeader>
              <CardTitle>Buttons</CardTitle>
              <CardDescription>All button variants and sizes.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Variants</h4>
                <div className="flex flex-wrap gap-2">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium mb-2">Sizes</h4>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Card 2: Form Components */}
          <Card>
            <CardHeader>
              <CardTitle>Form Components</CardTitle>
              <CardDescription>
                Input fields, labels, and textareas.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="demo-email">Email</Label>
                <Input
                  id="demo-email"
                  type="email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo-password">Password</Label>
                <Input
                  id="demo-password"
                  type="password"
                  placeholder="Enter your password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="demo-message">Message</Label>
                <Textarea
                  id="demo-message"
                  placeholder="Enter your message"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 3: Avatar */}
          <Card>
            <CardHeader>
              <CardTitle>Avatar</CardTitle>
              <CardDescription>
                User avatar display with fallback.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4 items-center">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <Avatar className="h-16 w-16">
                  <AvatarFallback>LG</AvatarFallback>
                </Avatar>
              </div>
              <p className="text-sm text-muted-foreground">
                Avatars with images, fallbacks, and different sizes.
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Calendar */}
          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Date picker component.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </CardContent>
          </Card>

          {/* Card 5: Drawer */}
          <Card>
            <CardHeader>
              <CardTitle>Drawer</CardTitle>
              <CardDescription>Slide-out drawer component.</CardDescription>
            </CardHeader>
            <CardContent>
              <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Drawer
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>Drawer Title</DrawerTitle>
                    <DrawerDescription>
                      This is a drawer component that slides up from the bottom.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Drawer content goes here.
                    </p>
                  </div>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button variant="outline">Close</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>

          {/* Card 6: Dropdown Menu */}
          <Card>
            <CardHeader>
              <CardTitle>Dropdown Menu</CardTitle>
              <CardDescription>Context menu with items.</CardDescription>
            </CardHeader>
            <CardContent>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full">
                    Open Menu <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>

          {/* Card 7: Popover */}
          <Card>
            <CardHeader>
              <CardTitle>Popover</CardTitle>
              <CardDescription>Floating popup component.</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    Open Popover
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Popover Title</h4>
                    <p className="text-sm text-muted-foreground">
                      This is a popover component that appears on top of other
                      content.
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </CardContent>
          </Card>

          {/* Card 8: Toast */}
          <Card>
            <CardHeader>
              <CardTitle>Toast</CardTitle>
              <CardDescription>Notification toast system.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleToast} className="w-full">
                Show Toast
              </Button>
            </CardContent>
          </Card>

          {/* Card 9: Location Input */}
          <Card>
            <CardHeader>
              <CardTitle>Location Input</CardTitle>
              <CardDescription>
                Google Maps location autocomplete.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="location">Search Location</Label>
                <LocationInput
                  id="location"
                  placeholder="Search for a location..."
                  onLocationSelect={(location: { description: string }) => {
                    const desc = location.description;
                    setSelectedLocation(desc);
                    toast("Location Selected", {
                      description: desc,
                    });
                  }}
                />
              </div>
              {selectedLocation && (
                <div className="text-sm text-muted-foreground">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Selected: {selectedLocation}
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Note: Requires Google Maps API key to function.
              </p>
            </CardContent>
          </Card>

          {/* Card 10: GIF Search */}
          <Card>
            <CardHeader>
              <CardTitle>GIF Search</CardTitle>
              <CardDescription>
                Search and select GIFs from Tenor.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setGifSearchOpen(true);
                }}
                variant="outline"
                className="w-full"
              >
                <Search className="mr-2 h-4 w-4" />
                Open GIF Search
              </Button>
              <GifSearch
                isOpen={gifSearchOpen}
                onClose={() => {
                  setGifSearchOpen(false);
                }}
                onSelectGif={handleGifSelect}
                apiKey={import.meta.env.VITE_TENOR_API_KEY}
              />
            </CardContent>
          </Card>

          {/* Card 11: Image Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Image Upload</CardTitle>
              <CardDescription>Upload and crop profile images.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <ImageUpload
                  userId="demo-user"
                  onImageUploaded={(fileName: string) => {
                    console.log("Uploaded file:", fileName);
                    toast("Image Uploaded", {
                      description: `File: ${fileName}`,
                    });
                  }}
                  user={{
                    id: "demo-user",
                    displayName: "Demo User",
                    profilePicture: undefined,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Click the camera icon to upload or take a photo.
              </p>
            </CardContent>
          </Card>

          {/* Card 12: Tutorial Carousel */}
          <Card>
            <CardHeader>
              <CardTitle>Tutorial Carousel</CardTitle>
              <CardDescription>
                Step-by-step tutorial component.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={() => {
                  setTutorialOpen(true);
                }}
                variant="outline"
                className="w-full"
              >
                Launch Tutorial
              </Button>
              {tutorialOpen && (
                <TutorialCarousel
                  slides={tutorialSlides}
                  onComplete={() => {
                    setTutorialOpen(false);
                    toast("Tutorial Complete", {
                      description: "You've finished the tutorial!",
                    });
                  }}
                  Button={
                    Button as React.ComponentType<{
                      variant?: string;
                      size?: string;
                      onClick?: () => void;
                      disabled?: boolean;
                      className?: string;
                      children?: React.ReactNode;
                    }>
                  }
                />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <ComponentShowcase />
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
