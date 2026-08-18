"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useRef, useState } from "react";

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
  const imageRef = useRef<HTMLImageElement>(null);
  const [status, setStatus] = useState<"failed" | "loaded" | "loading">(
    "loading",
  );

  useEffect(() => {
    setStatus("loading");
    const image = imageRef.current;

    if (!image?.complete) return;
    setStatus(image.naturalWidth > 0 ? "loaded" : "failed");
  }, [src]);

  const handleError: NonNullable<ImageProps["onError"]> = (event) => {
    setStatus("failed");
    onError?.(event);
  };

  if (status === "failed") {
    return null;
  }

  return (
    <Image
      ref={imageRef}
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      style={{
        ...props.style,
        visibility: status === "loaded" ? undefined : "hidden",
      }}
      onError={handleError}
      onLoad={(event) => {
        setStatus("loaded");
        props.onLoad?.(event);
      }}
    />
  );
}
