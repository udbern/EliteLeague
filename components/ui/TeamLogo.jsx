"use client";
import Image from "next/image";
import { urlFor } from "@/lib/sanityClient"
export default function TeamLogo({ logo, alt = "Team Logo", size = 35, className = "" }) {
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
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center rounded-full overflow-hidden bg-white border border-gray-200`}
    >
      <Image
        src={getImageSrc(logo)}
        alt={alt}
        width={size}
        height={size}
        className="object-contain object-center w-full h-full"
        unoptimized
      />
    </div>
  );
} 