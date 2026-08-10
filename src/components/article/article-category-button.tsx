import { Button } from "@workspace/web-design-system/components/button";

type ArticleCategoryButtonProps = Omit<
  React.ComponentProps<typeof Button>,
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
