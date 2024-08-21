export const UNQUOTED_ALLOWED_CHARS = '[A-Za-zÀ-ÖØ-öø-ÿ0-9-]+';
export const QUOTED_ALLOWED_CHARS = '[A-Za-zÀ-ÖØ-öø-ÿ0-9, -]+';
export const LIST_REGEX_BASE = `(${UNQUOTED_ALLOWED_CHARS}|"${QUOTED_ALLOWED_CHARS}")(,(${UNQUOTED_ALLOWED_CHARS}|"${QUOTED_ALLOWED_CHARS}"))*`;

/**
 * List represents a list of values, quoted or not.
 *
 * e.g. 1
 * e.g 1,2
 * e.g "a","b"
 * e.g "a",b
 */
export function parseList(list: string) {
    const parsedItems = [];

    let currentItem = '';
    let currentQuoted = false;
    for (const char of list) {
        if (char === ',') {
            if (currentQuoted) {
                currentItem += char;
                continue;
            }

            parsedItems.push(currentItem);
            currentItem = '';
            continue;
        }

        if (char === '"') {
            currentQuoted = !currentQuoted;
            continue;
        }

        currentItem += char;
    }
    if (currentItem) {
        parsedItems.push(currentItem);
    }

    return parsedItems.map((v: string) => {
        const parsedFloat = Number.parseFloat(v);
        if (!Number.isNaN(parsedFloat)) {
            return parsedFloat;
        }
        return v;
    });
}
