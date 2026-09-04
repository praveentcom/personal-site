import { ButtonLink } from "@avgeek-inc/ds-web/buttons/button";

import { URLS } from "@/components/helpers/urls";
import { EnumCommunityContributionType } from "@/types/community";

type CommunityTypeButtonProps = Omit<
  React.ComponentProps<typeof ButtonLink>,
  "children" | "href"
> & {
  type: EnumCommunityContributionType;
  href?: string;
  variant?: React.ComponentProps<typeof ButtonLink>["variant"];
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
  href = URLS.COMMUNITY_TYPE(type),
  ...props
}: CommunityTypeButtonProps) {
  return (
    <ButtonLink {...props} className={className} href={href} variant={variant}>
      {getCommunityTypeLabel(type)}
    </ButtonLink>
  );
}
