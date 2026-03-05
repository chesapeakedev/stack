// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */

import { Camera, RotateCw, Upload } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar.tsx";
import { Button } from "../ui/button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";

/**
 * Data structure returned when a user is updated
 */
interface UserUpdateData {
  /** User's unique identifier */
  id: string;
  /** User's display name */
  displayName: string;
  /** Optional profile picture URL */
  profilePicture?: string;
}

/**
 * Props for the ImageUpload component
 */
interface ImageUploadProps {
  /** User's unique identifier */
  userId: string;
  /** Current image URL or filename */
  currentImage?: string;
  /** Callback when image is successfully uploaded */
  onImageUploaded: (fileName: string) => void;
  /** Current user data (optional, for updating after upload) */
  user?: {
    id: string;
    displayName: string;
    profilePicture?: string;
  };
  /** Callback to update user data after upload */
  updateUser?: (user: UserUpdateData) => void;
  /**
   * Base URL for API endpoints.
   * @default ""
   * @example "https://api.example.com" or "/api"
   */
  apiBaseUrl?: string;
  /**
   * Endpoint for uploading images.
   * The endpoint should accept a FormData with 'image' and 'userId' fields.
   * @default "/users/upload-image"
   */
  uploadEndpoint?: string;
  /**
   * Endpoint for fetching profile picture URLs.
   * The userId will be appended to this endpoint.
   * @default "/profile-picture"
   */
  profilePictureEndpoint?: string;
  /**
   * URL for the default/fallback image.
   * @default "/images/default-profile.jpg"
   */
  defaultImageUrl?: string;
}

/**
 * Crop area configuration for image editing
 */
interface CropArea {
  /** X position as percentage (0-100) */
  x: number;
  /** Y position as percentage (0-100) */
  y: number;
  /** Size of crop area as percentage (0-100) */
  size: number;
}

/**
 * An image upload component with camera capture, cropping, and rotation support.
 *
 * This component provides a complete image upload solution including:
 * - File upload from device
 * - Camera capture (with fallback)
 * - Circular crop with drag-to-position
 * - Image rotation
 * - Zoom controls
 * - Error handling with fallback image
 *
 * The component expects your backend to provide two endpoints:
 * 1. Upload endpoint: Accepts POST with FormData (image, userId), returns { fileName: string }
 * 2. Profile picture endpoint: GET endpoint that returns { url: string } for a given userId
 *
 * @example
 * ```tsx
 * function ProfileSettings() {
 *   const [user, setUser] = useState({ id: "123", displayName: "John" });
 *
 *   return (
 *     <ImageUpload
 *       userId={user.id}
 *       currentImage={user.profilePicture}
 *       onImageUploaded={(fileName) => {
 *         console.log("Uploaded:", fileName);
 *       }}
 *       user={user}
 *       updateUser={setUser}
 *       apiBaseUrl="/api"
 *     />
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With custom endpoints
 * <ImageUpload
 *   userId="123"
 *   onImageUploaded={handleUpload}
 *   apiBaseUrl="https://api.example.com"
 *   uploadEndpoint="/v2/upload-avatar"
 *   profilePictureEndpoint="/v2/avatar"
 *   defaultImageUrl="/assets/default-avatar.png"
 * />
 * ```
 */
export function ImageUpload({
  userId,
  currentImage,
  onImageUploaded,
  user,
  updateUser,
  apiBaseUrl = "",
  uploadEndpoint = "/users/upload-image",
  profilePictureEndpoint = "/profile-picture",
  defaultImageUrl = "/images/default-profile.jpg",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [uploadError, setUploadError] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(defaultImageUrl);
  const [showCamera, setShowCamera] = useState(false);
  const [showCrop, setShowCrop] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cropArea, setCropArea] = useState<CropArea>({
    x: 50,
    y: 50,
    size: 80,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const cropImageRef = useRef<HTMLImageElement>(null);
  const cropContainerRef = useRef<HTMLDivElement>(null);

  // Fetch image URL when currentImage changes
  useEffect(() => {
    const fetchImageUrl = async () => {
      if (preview) {
        setImageUrl(preview);
        return;
      }

      if (!currentImage) {
        setImageUrl(defaultImageUrl);
        return;
      }

      if (currentImage.startsWith("http")) {
        setImageUrl(currentImage);
        return;
      }

      try {
        const endpoint = `${apiBaseUrl}${profilePictureEndpoint}/${userId}`;
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = (await response.json()) as { url: string };
          setImageUrl(data.url);
        } else {
          setImageUrl(defaultImageUrl);
        }
      } catch (error) {
        console.error("Error fetching image URL:", error);
        setImageUrl(defaultImageUrl);
      }
    };

    void fetchImageUrl();
  }, [
    currentImage,
    preview,
    userId,
    apiBaseUrl,
    profilePictureEndpoint,
    defaultImageUrl,
  ]);

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });
      }
    };
  }, []);

  // Prevent wheel events on body when crop modal is open
  useEffect(() => {
    if (showCrop) {
      const preventWheel = (e: WheelEvent) => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };

      // Add multiple event listeners to catch all wheel events
      document.body.addEventListener("wheel", preventWheel, {
        passive: false,
        capture: true,
      });
      document.body.addEventListener("wheel", preventWheel, {
        passive: false,
        capture: false,
      });
      document.body.style.overflow = "hidden";

      return () => {
        document.body.removeEventListener("wheel", preventWheel, {
          capture: true,
        });
        document.body.removeEventListener("wheel", preventWheel, {
          capture: false,
        });
        document.body.style.overflow = "";
      };
    }
  }, [showCrop]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    const file = files?.[0];
    if (!file) return;

    // Create preview and show crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCameraSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    const file = files?.[0];
    if (!file) return;

    // Create preview and show crop modal
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setShowCrop(true);
    };
    reader.readAsDataURL(file);
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
      });

      streamRef.current = stream;
      setShowCamera(true);

      // Set the video stream after the modal is rendered
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (error) {
      console.error("Error accessing camera:", error);
      // Fallback to file input if camera access fails
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    setShowCamera(false);
  };

  const capturePhoto = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        // Set canvas size to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw video frame to canvas
        context.drawImage(video, 0, 0);

        // Convert canvas to blob
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const file = new File([blob], "camera-photo.jpg", {
                type: "image/jpeg",
              });
              const reader = new FileReader();
              reader.onloadend = () => {
                setOriginalImage(reader.result as string);
                setShowCrop(true);
              };
              reader.readAsDataURL(file);
              setShowCamera(false);
            }
          },
          "image/jpeg",
          0.8
        );
      }
    }
  };

  const handleCropMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCropMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !cropContainerRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const container = cropContainerRef.current.getBoundingClientRect();
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;

    setCropArea((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(100, prev.x + (deltaX / container.width) * 100)),
      y: Math.max(0, Math.min(100, prev.y + (deltaY / container.height) * 100)),
    }));

    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleCropMouseUp = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleCropResize = (direction: "in" | "out") => {
    const delta = direction === "in" ? -2 : 2;
    setCropArea((prev) => ({
      ...prev,
      size: Math.max(20, Math.min(100, prev.size + delta)),
    }));
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const cropImage = () => {
    if (!originalImage || !cropImageRef.current) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = cropImageRef.current;

    // Wait for image to load
    if (!img.complete || img.naturalWidth === 0) {
      img.onload = () => {
        cropImage();
      };
      return;
    }

    // Set canvas size for the final cropped image
    const size = 400; // Final size for profile picture
    canvas.width = size;
    canvas.height = size;

    // Get container dimensions
    const container = cropContainerRef.current?.getBoundingClientRect();
    if (!container) return;

    // Calculate how the image is actually displayed (object-cover behavior)
    const imgAspect = img.naturalWidth / img.naturalHeight;
    const containerAspect = container.width / container.height;

    let displayedWidth, displayedHeight, offsetX, offsetY;

    if (imgAspect > containerAspect) {
      // Image is wider than container - height fills container
      displayedHeight = container.height;
      displayedWidth = container.height * imgAspect;
      offsetX = (container.width - displayedWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller than container - width fills container
      displayedWidth = container.width;
      displayedHeight = container.width / imgAspect;
      offsetX = 0;
      offsetY = (container.height - displayedHeight) / 2;
    }

    // Calculate crop area in pixels relative to the displayed image
    const cropSizePx =
      (cropArea.size / 100) * Math.min(container.width, container.height);
    const cropX = (cropArea.x / 100) * container.width - cropSizePx / 2;
    const cropY = (cropArea.y / 100) * container.height - cropSizePx / 2;

    // Convert crop coordinates to actual image coordinates
    const scaleX = img.naturalWidth / displayedWidth;
    const scaleY = img.naturalHeight / displayedHeight;

    const actualCropX = (cropX - offsetX) * scaleX;
    const actualCropY = (cropY - offsetY) * scaleY;
    const actualCropSize = cropSizePx * scaleX;

    // Apply rotation and crop to final canvas
    ctx.save();
    ctx.translate(size / 2, size / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.beginPath();
    ctx.arc(0, 0, size / 2, 0, 2 * Math.PI);
    ctx.clip();
    ctx.drawImage(
      img,
      actualCropX,
      actualCropY,
      actualCropSize,
      actualCropSize,
      -size / 2,
      -size / 2,
      size,
      size
    );
    ctx.restore();

    // Convert to blob and upload
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "cropped-profile.jpg", {
            type: "image/jpeg",
          });
          void handleUpload(file);
          setShowCrop(false);
          setOriginalImage(null);
          setRotation(0);
          setCropArea({ x: 50, y: 50, size: 80 });
        }
      },
      "image/jpeg",
      0.9
    );
  };

  const handleUpload = async (file: File) => {
    setUploading(true);
    setUploadError(false);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);

      const endpoint = `${apiBaseUrl}${uploadEndpoint}`;
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = (await response.json()) as {
        fileName: string;
        user?: UserUpdateData;
      };
      onImageUploaded(data.fileName);

      // Update the user data with the new profile picture
      if (data.user && user && updateUser) {
        updateUser(data.user);
      }

      // Clear preview after successful upload
      setPreview(null);
    } catch (error) {
      console.error("Error uploading image:", error);
      setUploadError(true);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCameraClick = () => {
    // Try to use getUserMedia API first (better for desktop)
    void startCamera();
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.error("Error loading image:", e);
    setImageError(true);
    setImageUrl(defaultImageUrl);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleCameraSelect}
        accept="image/*"
        capture="user"
        className="hidden"
      />

      {/* Camera Modal */}
      {showCamera && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div
            className="bg-background rounded-lg p-4 max-w-md w-full mx-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Take Photo</h3>
              <p className="text-sm text-muted-foreground">
                Position your face in the camera
              </p>
            </div>

            <div className="relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full rounded-lg"
              />
              <canvas ref={canvasRef} className="hidden" />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation();
                  stopCamera();
                }}
                className="flex-1"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={capturePhoto}
                className="flex-1"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Take Photo"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Crop Modal */}
      {showCrop && originalImage && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          style={{ zIndex: 9999 }}
          onClick={(e) => {
            e.stopPropagation();
          }}
          onWheel={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div
            className="bg-background rounded-lg p-4 max-w-lg w-full mx-4"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="text-center mb-4">
              <h3 className="text-lg font-semibold">Crop Profile Picture</h3>
              <p className="text-sm text-muted-foreground">
                Drag to move, scroll to resize, rotate if needed
              </p>
            </div>

            <div
              ref={cropContainerRef}
              className="relative w-full aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-move select-none"
              style={{
                userSelect: "none",
                WebkitUserSelect: "none",
                touchAction: "none",
              }}
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={handleCropMouseUp}
              onMouseLeave={handleCropMouseUp}
              onTouchStart={(e) => {
                e.preventDefault();
              }}
              onTouchMove={(e) => {
                e.preventDefault();
              }}
            >
              <img
                ref={cropImageRef}
                src={originalImage}
                alt="Crop"
                className="w-full h-full object-cover"
                style={{
                  transform: `rotate(${String(rotation)}deg)`,
                }}
              />

              {/* Crop overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${String(cropArea.x)}% ${String(
                    cropArea.y
                  )}%, transparent ${String(cropArea.size / 2)}%, rgba(0, 0, 0, 0.5) ${String(
                    cropArea.size / 2
                  )}%)`,
                }}
              />

              {/* Crop circle outline */}
              <div
                className="absolute border-2 border-white border-dashed pointer-events-none"
                style={{
                  left: `${String(cropArea.x - cropArea.size / 2)}%`,
                  top: `${String(cropArea.y - cropArea.size / 2)}%`,
                  width: `${String(cropArea.size)}%`,
                  height: `${String(cropArea.size)}%`,
                  borderRadius: "50%",
                }}
              />
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCrop(false);
                  setOriginalImage(null);
                  setRotation(0);
                  setCropArea({ x: 50, y: 50, size: 80 });
                }}
                className="flex-1"
                disabled={uploading}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={rotateImage}
                disabled={uploading}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleCropResize("out");
                }}
                disabled={uploading}
                className="flex-1"
              >
                Zoom Out
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  handleCropResize("in");
                }}
                disabled={uploading}
                className="flex-1"
              >
                Zoom In
              </Button>
            </div>

            <div className="flex gap-2 mt-2">
              <Button
                type="button"
                onClick={cropImage}
                className="flex-1"
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Crop & Save"}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="relative">
        <Avatar className="h-24 w-24">
          <AvatarImage
            src={imageUrl}
            alt="Profile"
            onError={handleImageError}
          />
          <AvatarFallback>
            {(userId.length > 0 ? userId[0] : "?").toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              size="icon"
              variant="secondary"
              className="absolute bottom-0 right-0 rounded-full"
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleUploadClick}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Photo
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCameraClick}>
              <Camera className="mr-2 h-4 w-4" />
              Take Photo
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {uploading && (
        <p className="text-sm text-muted-foreground">Uploading...</p>
      )}
      {uploadError && (
        <p className="text-sm text-red-500">Failed to upload image</p>
      )}
      {imageError && (
        <p className="text-sm text-red-500">Failed to load image</p>
      )}
    </div>
  );
}
