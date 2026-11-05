const DEFAULT_AVATAR = {
  url: 'https://cdn.aurora-profiles.dev/avatars/default.png',
  initials: '?',
  source: 'fallback',
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function isRetryable(error) {
  // Retry AbortError.
  if (error && error.name === 'AbortError') {
    return true;
  }

  // Check HTTP status.
  const status = error?.status ?? error?.statusCode ?? error?.response?.status;

  // Retry network errors with no HTTP status.
  if (status === undefined || status === null) {
    return true;
  }

  // Retry 429 and 5xx errors only.
  return status === 429 || (status >= 500 && status <= 599);
}

async function withTimeout(operation, timeoutMs) {
  const controller = new AbortController();
  let timer;

  try {
    return await Promise.race([
      operation(controller.signal),
      new Promise((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();

          const error = new Error('Operation timed out');
          error.name = 'AbortError';

          reject(error);
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function withRetry(operation, options = {}) {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 25;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      if (!isRetryable(error) || attempt === maxAttempts - 1) {
        throw error;
      }

      await sleep(baseDelayMs * 2 ** attempt);
    }
  }
}

async function getProfileWithAvatar(authorId, avatarClient, options = {}) {
  const timeoutMs = options.timeoutMs || 200;
  const maxAttempts = options.maxAttempts || 3;
  const baseDelayMs = options.baseDelayMs || 25;

  try {
    const avatar = await withRetry(
      () =>
        withTimeout(
          signal => avatarClient.getAvatar(authorId, signal),
          timeoutMs
        ),
      { maxAttempts, baseDelayMs }
    );

    return {
      authorId,
      avatar,
      degraded: false,
    };
  } catch (error) {
    return {
      authorId,
      avatar: DEFAULT_AVATAR,
      degraded: true,
    };
  }
}

module.exports = {
  DEFAULT_AVATAR,
  sleep,
  isRetryable,
  withTimeout,
  withRetry,
  getProfileWithAvatar,
};