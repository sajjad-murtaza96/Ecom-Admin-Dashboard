"use client";
import Image, { type ImageProps } from "next/image";
import { useState } from "react";

const FALLBACK_IMAGE = "/images/product-placeholder.svg";

type ProductImageProps = Omit<ImageProps, "src" | "onError"> & {
  src: string | null;
};

export const ProductImage = ({ src, alt, ...props }: ProductImageProps) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const imageSrc = src?.trim() || FALLBACK_IMAGE;

  return (
    <Image
      {...props}
      src={failedSrc === imageSrc ? FALLBACK_IMAGE : imageSrc}
      alt={alt}
      onError={() => setFailedSrc(imageSrc)}
    />
  );
};