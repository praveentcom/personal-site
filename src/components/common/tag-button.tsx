import { Button } from "@workspace/web-design-system/buttons/button";

import { getTagImagePath } from "@/components/helpers/tag-mapper";

import { ImageWithFallback } from "./image-with-fallback";

type TagButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  tag: string;
  showIcon?: boolean;
  count?: number;
};

export function TagButton({
  tag,
  className,
  showIcon = true,
  count,
  variant = "secondary",
  ...props
}: TagButtonProps) {
  const label = count && count > 1 ? `${tag} (${count})` : tag;

  return (
    <Button {...props} variant={variant} className={className}>
      {showIcon && (
        <ImageWithFallback
          src={getTagImagePath(tag)}
          alt={`${tag} icon`}
          width={20}
          height={20}
          className="shrink-0"
        />
      )}
      <span>{label}</span>
    </Button>
  );
}
