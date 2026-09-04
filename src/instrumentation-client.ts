import {
  captureRouterTransitionStart,
  initializeSentryClient,
} from "@workspace/web-runtime/sentry-client";

initializeSentryClient();

export const onRouterTransitionStart = captureRouterTransitionStart;
