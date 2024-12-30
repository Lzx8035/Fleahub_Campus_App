"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ImageCarouselProps {
  images: string[];
}

function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const nextImage = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const previousImage = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
      <div
        className="absolute inset-0 flex transition-transform duration-300 ease-in-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, index) => (
          <div key={src} className="min-w-full h-full relative">
            <Image
              src={src}
              alt={`Product image ${index + 1}`}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                isLoading ? "opacity-0" : "opacity-100"
              )}
              onLoadingComplete={() => setIsLoading(false)}
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <>
          <button
            onClick={previousImage}
            disabled={currentIndex === 0}
            className={cn(
              "absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full",
              "transition-all duration-200",
              "hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed",
              currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
            )}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={nextImage}
            disabled={currentIndex === images.length - 1}
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full",
              "transition-all duration-200",
              "hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed",
              currentIndex === images.length - 1
                ? "opacity-50 cursor-not-allowed"
                : ""
            )}
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={cn(
                  "h-2 w-2 rounded-full transition-colors duration-200",
                  i === currentIndex
                    ? "bg-white"
                    : "bg-white/50 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-pulse">Loading...</div>
        </div>
      )}
    </div>
  );
}

export default ImageCarousel;
