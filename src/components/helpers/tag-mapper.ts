const icons: Record<string, string> = {
  AWS: "/images/tags/aws.png",
  macOS: "/images/tags/macos.png",
  Xcode: "/images/tags/xcode.png",
  Swift: "/images/tags/swift.png",
  iOS: "/images/tags/ios.png",
  Vercel: "/images/tags/vercel.png",
  "Google Cloud Platform": "/images/tags/googlecloudplatform.png",
};

export function getTagImagePath(tag: string): string | undefined {
  return icons[tag];
}
