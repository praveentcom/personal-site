import {
  captureRouterTransitionStart,
  initializeSentryClient,
} from "@avgeek-inc/observability-sentry/next/client";

initializeSentryClient();

export const onRouterTransitionStart = captureRouterTransitionStart;
