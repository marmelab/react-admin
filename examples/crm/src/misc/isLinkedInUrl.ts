const LINKEDIN_URL_REGEX = /^http(?:s)?:\/\/(?:www\.)?linkedin.com\//;

export const isLinkedinUrl = (url: string) => {
    if (!url) return;
    try {
        // Parse the URL to ensure it is valid
        const parsedUrl = new URL(url);
        if (!parsedUrl.href.match(LINKEDIN_URL_REGEX)) {
            return 'URL must be from linkedin.com';
        }
    } catch (e) {
        // If URL parsing fails, return false
        return 'Must be a valid URL';
    }
};
