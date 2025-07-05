"use client";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient";

export default function TeamLogo({ logo, alt = "Team Logo", size = 24, className = "" }) {
  // Helper: Get image src from Sanity or fallback local
  const getImageSrc = (logo) => {
    if (logo && logo.asset?._ref) {
      return urlFor(logo).url();
    } else if (typeof logo === "string") {
      return logo;
    } else {
      return "/placeholder.png";
    }
  };

  return (
    <Image
      src={getImageSrc(logo)}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain object-center rounded-full max-w-[${size}px] max-h-[${size}px] ${className}`}
      unoptimized
    />
  );
} 