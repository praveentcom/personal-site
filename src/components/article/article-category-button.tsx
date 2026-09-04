import { Button, ButtonLink } from "@avgeek-inc/ds-web/buttons/button";

type ArticleCategoryButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children"
> & {
  category: string;
  count?: number;
};

type ArticleCategoryButtonLinkProps = Omit<
  React.ComponentProps<typeof ButtonLink>,
  "children"
> & {
  category: string;
  count?: number;
};

export function ArticleCategoryButton({
  category,
  className,
  count,
  variant = "secondary",
  ...props
}: ArticleCategoryButtonProps) {
  const label = count && count > 1 ? `${category} (${count})` : category;

  return (
    <Button {...props} variant={variant} className={className}>
      {label}
    </Button>
  );
}

export function ArticleCategoryButtonLink({
  category,
  className,
  count,
  variant = "secondary",
  ...props
}: ArticleCategoryButtonLinkProps) {
  const label = count && count > 1 ? `${category} (${count})` : category;

  return (
    <ButtonLink {...props} variant={variant} className={className}>
      {label}
    </ButtonLink>
  );
}
