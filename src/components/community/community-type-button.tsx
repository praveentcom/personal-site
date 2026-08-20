import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import {
  Button,
  type buttonVariants,
} from "@workspace/web-design-system/buttons/button";

import { URLS } from "@/components/helpers/urls";
import { EnumCommunityContributionType } from "@/types/community";

type CommunityTypeButtonProps = Omit<
  React.ComponentProps<typeof Button>,
  "children" | "type"
> & {
  type: EnumCommunityContributionType;
  variant?: VariantProps<typeof buttonVariants>["variant"];
};

export const getCommunityTypeLabel = (value: EnumCommunityContributionType) => {
  switch (value) {
    case EnumCommunityContributionType.TALK_SESSION:
      return "Talk session";
    case EnumCommunityContributionType.WORKSHOP:
      return "Workshop";
    case EnumCommunityContributionType.ONLINE_COURSE:
      return "Online course";
    default:
      return "Generic contribution";
  }
};

export function CommunityTypeButton({
  type,
  variant = "secondary",
  className,
  render = <Link href={URLS.COMMUNITY_TYPE(type)} />,
  ...props
}: CommunityTypeButtonProps) {
  return (
    <Button {...props} variant={variant} className={className} render={render}>
      {getCommunityTypeLabel(type)}
    </Button>
  );
}
