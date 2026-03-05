// Copyright 2026 Chesapeake Computing
// SPDX-License-Identifier: Apache-2.0

/** @jsxImportSource react */
import React, { useState } from "react";

interface TutorialSlide {
  id: number;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

interface TutorialCarouselProps {
  onComplete: () => void;
  Button: React.ComponentType<{
    variant?: string;
    size?: string;
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    children?: React.ReactNode;
  }>;
  slides: TutorialSlide[];
}

const colorMap: Record<string, string> = {
  blue: "text-blue-500",
  green: "text-green-500",
  purple: "text-purple-500",
  red: "text-red-500",
  orange: "text-orange-500",
  yellow: "text-yellow-500",
};

export function TutorialCarousel({
  onComplete,
  Button,
  slides,
}: TutorialCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const skipTutorial = () => {
    onComplete();
  };

  const currentSlideData = slides[currentSlide];
  const IconComponent = currentSlideData.icon;
  const iconColor = colorMap[currentSlideData.color] || "text-primary";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg p-6 max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
        {/* Skip button */}
        <div className="flex justify-end mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={skipTutorial}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip
          </Button>
        </div>

        {/* Slide content */}
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="p-4 rounded-full bg-muted">
              <IconComponent className={`h-12 w-12 ${iconColor}`} />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold">{currentSlideData.title}</h2>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed">
            {currentSlideData.description}
          </p>

          {/* Progress dots */}
          <div className="flex justify-center space-x-2 mb-6">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-2 w-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-primary" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={prevSlide}
            disabled={currentSlide === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button onClick={nextSlide} className="flex-1">
            {currentSlide === slides.length - 1 ? "Get Started!" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}
