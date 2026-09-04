import {
  captureRequestError,
  registerSentry,
} from "@workspace/web-runtime/sentry";

export async function register() {
  await registerSentry();
}

export const onRequestError = captureRequestError;
