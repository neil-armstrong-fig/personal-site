import {workerEnvironment} from "@src/env/WorkerEnvironment";

const siteVerifyUrl = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const formHeaders = {"Content-Type": "application/x-www-form-urlencoded"};

interface SiteVerifyResult {
  success?: boolean;
}

// Fails closed: anything other than an explicit `success: true` from Cloudflare counts as "not verified".
export async function verifyTurnstile(token: string, remoteIp: string | undefined): Promise<boolean> {
  const body = new URLSearchParams({secret: workerEnvironment.TURNSTILE_SECRET, response: token});

  if (remoteIp !== undefined) {
    body.set("remoteip", remoteIp);
  }

  try {
    const response = await fetch(siteVerifyUrl, {method: "POST", body: body.toString(), headers: formHeaders});

    if (!response.ok) {
      return false;
    }

    const siteVerifyResult = (await response.json()) as SiteVerifyResult;

    return siteVerifyResult.success === true;
  } catch {
    return false;
  }
}
