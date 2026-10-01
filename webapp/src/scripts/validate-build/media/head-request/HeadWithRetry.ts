type FetchFunction = (url: string, init: RequestInit) => Promise<Response>;

interface RetryOptions {
  attempts: number;
  delayMs: number;
}

const requestTimeoutMs = 10_000;

// Retries only transport failures (a timeout or an unreachable host). Any HTTP response, a 404 included, is returned
// at once, so a missing upload is never hidden behind a retry.
export async function headWithRetry(url: string, fetchFn: FetchFunction, options: RetryOptions): Promise<Response> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.attempts; attempt++) {
    try {
      return await fetchFn(url, {method: "HEAD", signal: AbortSignal.timeout(requestTimeoutMs)});
    } catch (error) {
      lastError = error;

      if (attempt < options.attempts) {
        await sleep(options.delayMs * attempt);
      }
    }
  }

  throw new Error(`${url} could not be reached after ${options.attempts} attempts: ${describeCause(lastError)}`);
}

function describeCause(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}
