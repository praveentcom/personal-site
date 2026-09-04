import {
  captureRequestError,
  registerSentry,
} from "@avgeek-inc/observability-sentry/next/server";

export async function register() {
  await registerSentry();
}

export const onRequestError = captureRequestError;
