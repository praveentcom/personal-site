import { Button } from "@workspace/web-design-system/components/button";

type YearButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  year: string;
};

export function YearButton({
  year,
  className,
  variant = "secondary",
  ...props
}: YearButtonProps) {
  const safeYear = /^\d+$/.test(year) ? year : "unknown";

  return (
    <Button {...props} variant={variant} className={className}>
      {safeYear}
    </Button>
  );
}
