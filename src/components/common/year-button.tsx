import {
  Button,
  ButtonLink,
} from "@workspace/web-design-system/buttons/button";

type YearButtonProps = Omit<React.ComponentProps<typeof Button>, "children"> & {
  year: string;
};

type YearButtonLinkProps = Omit<
  React.ComponentProps<typeof ButtonLink>,
  "children"
> & {
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

export function YearButtonLink({
  year,
  className,
  variant = "secondary",
  ...props
}: YearButtonLinkProps) {
  const safeYear = /^\d+$/.test(year) ? year : "unknown";

  return (
    <ButtonLink {...props} variant={variant} className={className}>
      {safeYear}
    </ButtonLink>
  );
}
