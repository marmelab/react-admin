type FetchParams = Parameters<typeof fetch>;

export async function fetchWithTimeout(
    resource: string,
    options: FetchParams[1] & { timeout?: number } = {}
) {
    const { timeout = 2000 } = options;

    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(resource, {
        ...options,
        signal: controller.signal,
    });
    clearTimeout(id);

    return response;
}
