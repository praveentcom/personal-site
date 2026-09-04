import {
  AiBookIcon,
  AiCloudIcon,
  AiEditingIcon,
  AiImageIcon,
  AiVideoIcon,
  Album02Icon,
  ArrowRight01Icon,
  AircraftGameIcon,
  AirportIcon,
  Award01Icon,
  Briefcase01Icon,
  CameraAiIcon,
  ChartLineData02Icon,
  ChatSpark01Icon,
  CheckListIcon,
  CreditCardIcon,
  Factory02Icon,
  Film01Icon,
  FilmRoll02Icon,
  FlowConnectionIcon,
  FolderLibraryIcon,
  GraduationScrollIcon,
  Home01Icon,
  Layers01Icon,
  Link01Icon,
  Logout03Icon,
  Menu01Icon,
  News01Icon,
  Notification02Icon,
  PaintBoardIcon,
  PlaneIcon,
  Rocket01Icon,
  Search01Icon,
  SecurityLockIcon,
  Settings01Icon,
  ShoppingBag02Icon,
  StarIcon,
  UserIcon,
  UserMultiple02Icon,
  WebhookIcon,
  WorkflowSquare06Icon,
} from "@hugeicons-pro/core-solid-rounded";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

import type { ShellIconName } from "./navigation-types";

const shellIcons = {
  aircraft: AircraftGameIcon,
  "ai-book": AiBookIcon,
  "ai-editing": AiEditingIcon,
  "ai-image": AiImageIcon,
  "ai-video": AiVideoIcon,
  album: Album02Icon,
  airport: AirportIcon,
  apps: FolderLibraryIcon,
  "arrow-right": ArrowRight01Icon,
  award: Award01Icon,
  briefcase: Briefcase01Icon,
  "camera-ai": CameraAiIcon,
  "chat-spark": ChatSpark01Icon,
  "check-list": CheckListIcon,
  "credit-card": CreditCardIcon,
  dashboard: ChartLineData02Icon,
  factory: Factory02Icon,
  film: Film01Icon,
  "film-roll": FilmRoll02Icon,
  "flow-connection": FlowConnectionIcon,
  graduation: GraduationScrollIcon,
  home: Home01Icon,
  integrations: Link01Icon,
  layers: Layers01Icon,
  logout: Logout03Icon,
  menu: Menu01Icon,
  news: News01Icon,
  notification: Notification02Icon,
  "paint-board": PaintBoardIcon,
  plane: PlaneIcon,
  provider: AiCloudIcon,
  rocket: Rocket01Icon,
  search: Search01Icon,
  security: SecurityLockIcon,
  settings: Settings01Icon,
  "shopping-bag": ShoppingBag02Icon,
  star: StarIcon,
  user: UserIcon,
  users: UserMultiple02Icon,
  webhook: WebhookIcon,
  workflow: WorkflowSquare06Icon,
} satisfies Record<ShellIconName, IconSvgElement>;

type ShellIconProps = Omit<
  React.ComponentProps<typeof HugeiconsIcon>,
  "icon"
> & {
  name: ShellIconName;
};

export function ShellIcon({ className, name, ...props }: ShellIconProps) {
  return (
    <HugeiconsIcon
      aria-hidden="true"
      {...props}
      className={className}
      icon={shellIcons[name]}
    />
  );
}
