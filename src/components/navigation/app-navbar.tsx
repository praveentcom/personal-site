"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Navbar } from "@avgeek-inc/ds-web/navigation/navbar";
import { useSidebar } from "@avgeek-inc/ds-web/navigation/sidebar";
import { Dropdown } from "@avgeek-inc/ds-web/collections/dropdown";
import { Button, buttonVariants } from "@avgeek-inc/ds-web/buttons/button";
import Image from "next/image";
import { Avatar } from "@avgeek-inc/ds-web/media/avatar";
import { BrandLockup } from "@avgeek-inc/ds-web/media/brand-lockup";
import { Separator } from "@avgeek-inc/ds-web/layout/separator";
import { ThemeSwitcher } from "@avgeek-inc/ds-web/controls/theme-switcher";
import {
  getGravatarUrl,
  getProfileInitials,
} from "@avgeek-inc/ds-web/lib/gravatar";
import { getBrandLogoProps } from "@workspace/image-assets/constants/brand-assets";
import { ShellIcon } from "./shell-icon";
import type {
  HeaderConfig,
  HeaderMenuConfig,
  ShellLinkConfig,
} from "./navigation-types";

type Props = {
  config: HeaderConfig;
  actions?: ReactNode;
  hasSidebar?: boolean;
  showThemeSwitcher?: boolean;
};

export function AppNavbar(props: Props) {
  return props.hasSidebar ? (
    <SidebarNavbar {...props} />
  ) : (
    <Navigation {...props} />
  );
}

function SidebarNavbar(props: Props) {
  const { isMobile, setMobileOpen, toggleSidebar } = useSidebar();
  return (
    <Navigation
      {...props}
      onSidebarToggle={isMobile ? () => setMobileOpen(true) : toggleSidebar}
    />
  );
}

function Navigation({
  config,
  actions,
  hasSidebar,
  showThemeSwitcher,
  onSidebarToggle,
}: Props & { onSidebarToggle?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const home = config.homeHrefOverrides?.find(
    (item) => item.pathname === pathname,
  );
  const links = config.navigation ?? [];
  const mobileLinks = links.flatMap((item) =>
    item.kind === "link"
      ? [item]
      : item.sections.flatMap((section) => section.links),
  );
  const cta = config.callToAction;
  return (
    <Navbar
      maxWidth="full"
      navigate={(href) => router.push(href)}
      isMenuOpen={menuOpen}
      onMenuOpenChange={setMenuOpen}
    >
      <Navbar.Header
        className={config.alignment === "center" ? "relative" : undefined}
      >
        {hasSidebar ? (
          <Button
            isIconOnly
            aria-label="Toggle navigation"
            variant="ghost"
            onPress={onSidebarToggle}
          >
            <ShellIcon name="menu" />
          </Button>
        ) : mobileLinks.length > 0 ? (
          <Navbar.MenuToggle
            className="md:hidden"
            aria-label={
              config.mobileNavigation?.accessibleLabel ?? "Toggle navigation"
            }
          />
        ) : null}
        <Navbar.Brand
          className={
            hasSidebar
              ? "md:hidden"
              : config.alignment === "center"
                ? "absolute start-1/2 -translate-x-1/2"
                : undefined
          }
        >
          <Link
            href={home?.href ?? config.homeHref}
            aria-label={config.brand.accessibleLabel}
            target={home?.external ? "_blank" : undefined}
            rel={home?.external ? "noopener noreferrer" : undefined}
          >
            <BrandLockup
              {...getBrandLogoProps(config.brand.id, {
                src: config.brand.logoSrc,
              })}
            >
              {config.brand.title}
            </BrandLockup>
          </Link>
        </Navbar.Brand>
        <Navbar.Spacer />
        <Navbar.Content className="hidden md:flex">
          {links.map((item) =>
            item.kind === "link" ? (
              <Navbar.Item
                key={item.id}
                href={item.href}
                aria-label={item.accessibleLabel}
                isCurrent={isLinkActive(pathname, item)}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
              >
                {item.label}
              </Navbar.Item>
            ) : (
              <Dropdown key={item.id}>
                <Button variant="ghost">{item.label}</Button>
                <Dropdown.Popover>
                  <Dropdown.Menu aria-label={item.label}>
                    {item.sections
                      .flatMap((section) => section.links)
                      .map((link) => (
                        <Dropdown.Item
                          key={link.id}
                          id={link.id}
                          href={link.href}
                          aria-label={link.accessibleLabel}
                          render={
                            link.external
                              ? undefined
                              : (props) => (
                                  <Link
                                    {...(props as ComponentProps<typeof Link>)}
                                    href={link.href}
                                  />
                                )
                          }
                          target={link.external ? "_blank" : undefined}
                          rel={
                            link.external ? "noopener noreferrer" : undefined
                          }
                          textValue={link.label}
                        >
                          {link.iconSrc ? (
                            <Image
                              unoptimized
                              alt=""
                              src={link.iconSrc}
                              width={20}
                              height={20}
                              className="size-5 object-contain"
                            />
                          ) : link.icon ? (
                            <ShellIcon name={link.icon} />
                          ) : null}
                          {link.label}
                        </Dropdown.Item>
                      ))}
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ),
          )}
        </Navbar.Content>
        {cta ? (
          <Link
            href={cta.href}
            target={cta.external ? "_blank" : undefined}
            rel={cta.external ? "noopener noreferrer" : undefined}
            className={buttonVariants({
              variant: cta.emphasis === "secondary" ? "secondary" : "primary",
            })}
          >
            {cta.label}
          </Link>
        ) : null}
        {config.notifications ? (
          <AccountMenu config={config.notifications} />
        ) : null}
        {config.menu ? <AccountMenu config={config.menu} /> : null}
        {actions}
        {showThemeSwitcher ? <ThemeSwitcher /> : null}
      </Navbar.Header>
      {mobileLinks.length > 0 ? (
        <Navbar.Menu>
          {mobileLinks.map((item) => (
            <Navbar.MenuItem
              key={item.id}
              href={item.href}
              aria-label={item.accessibleLabel}
              isCurrent={isLinkActive(pathname, item)}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
            >
              {item.label}
            </Navbar.MenuItem>
          ))}
        </Navbar.Menu>
      ) : null}
    </Navbar>
  );
}

function AccountMenu({ config }: { config: HeaderMenuConfig }) {
  const [open, setOpen] = useState(false);
  return (
    <Dropdown
      isOpen={open}
      onOpenChange={(value) => {
        setOpen(value);
        config.onOpenChange?.(value);
      }}
    >
      <Button
        aria-label={config.accessibleLabel}
        variant="ghost"
        isIconOnly={Boolean(config.avatar)}
      >
        {config.avatar ? (
          <Avatar>
            <Avatar.Image
              alt={config.avatar.name}
              src={getGravatarUrl({
                email: config.avatar.email,
                fallbackSeed: config.avatar.fallbackSeed,
                size: 80,
              })}
            />
            <Avatar.Fallback>
              {getProfileInitials(config.avatar.name)}
            </Avatar.Fallback>
          </Avatar>
        ) : (
          <>
            {config.icon ? <ShellIcon name={config.icon} /> : null}
            <span
              className={config.icon ? "sr-only sm:not-sr-only" : undefined}
            >
              {config.label ?? config.accessibleLabel}
            </span>
            {config.badgeCount ? <span>{config.badgeCount}</span> : null}
          </>
        )}
      </Button>
      <Dropdown.Popover placement="bottom end">
        {config.title || config.subtitle ? (
          <div className="px-3 py-2">
            <p>{config.title}</p>
            <p className="text-muted text-sm">{config.subtitle}</p>
          </div>
        ) : null}
        <Dropdown.Menu aria-label={config.accessibleLabel}>
          {config.items.map((item) =>
            item.kind === "separator" ? (
              <Separator key={item.id} />
            ) : item.kind === "link" ? (
              <Dropdown.Item
                key={item.id}
                id={item.id}
                href={item.href}
                aria-label={item.accessibleLabel}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noopener noreferrer" : undefined}
                textValue={item.label}
                render={
                  item.external
                    ? undefined
                    : (props) => (
                        <Link
                          {...(props as ComponentProps<typeof Link>)}
                          href={item.href}
                        />
                      )
                }
              >
                {item.icon ? <ShellIcon name={item.icon} /> : null}
                {item.label}
              </Dropdown.Item>
            ) : (
              <Dropdown.Item
                key={item.id}
                id={item.id}
                isDisabled={item.disabled}
                variant={item.destructive ? "danger" : "default"}
                textValue={item.label}
                onAction={() => {
                  setOpen(false);
                  item.onSelect();
                }}
              >
                {item.icon ? <ShellIcon name={item.icon} /> : null}
                {item.label}
              </Dropdown.Item>
            ),
          )}
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}

export function isLinkActive(
  pathname: string | null,
  link: Pick<ShellLinkConfig, "active" | "href">,
) {
  return Boolean(
    pathname &&
    (link.active?.paths ?? [link.href]).some((path) =>
      link.active?.mode === "exact"
        ? pathname === path
        : pathname === path || pathname.startsWith(`${path}/`),
    ),
  );
}
