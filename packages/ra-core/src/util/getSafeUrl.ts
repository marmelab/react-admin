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
export const isSafeUrl = (url: string): boolean =>
    !isJavaScriptProtocol.test(url);

// A javascript: URL can contain leading C0 control characters or spaces,
// and tabs or newlines anywhere (https://url.spec.whatwg.org/#url-parsing)
const isJavaScriptProtocol =
    // eslint-disable-next-line no-control-regex
    /^[\u0000-\u001F ]*j[\r\n\t]*a[\r\n\t]*v[\r\n\t]*a[\r\n\t]*s[\r\n\t]*c[\r\n\t]*r[\r\n\t]*i[\r\n\t]*p[\r\n\t]*t[\r\n\t]*:/i;
