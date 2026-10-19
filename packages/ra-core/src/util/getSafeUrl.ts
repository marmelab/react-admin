/**
 * Return the URL if it can be used as a link href without executing code,
 * or undefined otherwise (and log an error)
 *
 * Rejects javascript: URLs, including obfuscated ones (mixed case,
 * whitespace, control characters). Relative URLs are safe.
 *
 * @example
 * getSafeUrl('https://example.com'); // 'https://example.com'
 * getSafeUrl('/posts/1'); // '/posts/1'
 * getSafeUrl('javascript:alert(1)'); // undefined
 */
export const getSafeUrl = (url: string): string | undefined => {
    if (isSafeUrl(url)) {
        return url;
    }
    console.error(`Blocked unsafe URL: ${JSON.stringify(url)}`);
    return undefined;
};

/**
 * Check that a URL can be used as a link href without executing code
 *
 * @see getSafeUrl
 */
export const isSafeUrl = (url: string): boolean => {
    try {
        return new URL(url, window.location.href).protocol !== 'javascript:';
    } catch {
        return false;
    }
};
