import {workerEnvironment} from "@src/env/WorkerEnvironment";

import type {TurnstileVerificationResult} from "./TurnstileVerificationResult";

const siteVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const formHeaders = {"Content-Type": "application/x-www-form-urlencoded"};
const rejectedTokenErrorCodes = ["missing-input-response", "invalid-input-response", "timeout-or-duplicate"] as const;

interface SiteVerifyResult {
  success?: boolean;
  "error-codes"?: unknown;
}

// Fails closed while distinguishing a rejected visitor from a verification service failure for safe diagnostics.
export async function verifyTurnstile(
  token: string,
  remoteIp: string | undefined,
): Promise<TurnstileVerificationResult> {
  const body = new URLSearchParams({secret: workerEnvironment.TURNSTILE_SECRET, response: token});

  if (remoteIp !== undefined) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(siteVerifyUrl, {method: "POST", body: body.toString(), headers: formHeaders});

    if (!response.ok) {
      return "unavailable";
    }

    const siteVerifyResult = (await response.json()) as SiteVerifyResult;

    if (siteVerifyResult.success === true) {
      return "verified";
    }

    if (siteVerifyResult.success === false && hasOnlyRejectedTokenErrors(siteVerifyResult["error-codes"])) {
      return "rejected";
    }

    return "unavailable";
  } catch {
    return "unavailable";
  }
}

function hasOnlyRejectedTokenErrors(errorCodes: unknown): boolean {
  if (!Array.isArray(errorCodes) || errorCodes.length === 0) {
    return false;
  }

  return errorCodes.every((errorCode: unknown) => {
    if (typeof errorCode !== "string") {
      return false;
    }

    return rejectedTokenErrorCodes.some(rejectedTokenErrorCode => rejectedTokenErrorCode === errorCode);
  });
}
