import { Button, ButtonLink } from "@avgeek-inc/ds-web/buttons/button";

import { getTagImagePath } from "@/components/helpers/tag-mapper";

import { ImageWithFallback } from "./image-with-fallback";

type TagButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  tag: string;
  showIcon?: boolean;
  count?: number;
};

type TagButtonLinkProps = Omit<
  React.ComponentProps<typeof ButtonLink>,
  "children"
> & {
  tag: string;
  showIcon?: boolean;
  count?: number;
};

function TagButtonContent({
  count,
  showIcon,
  tag,
}: Pick<TagButtonProps, "count" | "showIcon" | "tag">) {
  const label = count && count > 1 ? `${tag} (${count})` : tag;

  return (
    <>
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
    </>
  );
}

export function TagButton({
  tag,
  className,
  showIcon = true,
  count,
  variant = "secondary",
  ...props
}: TagButtonProps) {
  return (
    <Button {...props} variant={variant} className={className}>
      <TagButtonContent count={count} showIcon={showIcon} tag={tag} />
    </Button>
  );
}

export function TagButtonLink({
  tag,
  className,
  showIcon = true,
  count,
  variant = "secondary",
  ...props
}: TagButtonLinkProps) {
  return (
    <ButtonLink {...props} variant={variant} className={className}>
      <TagButtonContent count={count} showIcon={showIcon} tag={tag} />
    </ButtonLink>
  );
}
