"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type ImageWithFallbackProps = ImageProps;

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [hasError, setHasError] = useState(false);

  const handleError: NonNullable<ImageProps["onError"]> = (event) => {
    setHasError(true);
    onError?.(event);
  };

  if (hasError) {
    return null;
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
    />
  );
}
