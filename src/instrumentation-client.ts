import {
  captureRouterTransitionStart,
  initializeSentryClient,
} from "@avgeek-inc/observability/next/client";

initializeSentryClient();

export const onRouterTransitionStart = captureRouterTransitionStart;
