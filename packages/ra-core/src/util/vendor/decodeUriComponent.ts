/**
 * Vendored from decode-uri-component@0.5.0 (https://github.com/SamVerschueren/decode-uri-component)
 * Source: index.js at tag v0.5.0
 *
 * The MIT License (MIT)
 *
 * Copyright (c) 2017, Sam Verschueren <sam.verschueren@gmail.com> (github.com/SamVerschueren)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * Modifications:
 * - Converted to TypeScript: typed the exported function signature
 *   (from the upstream index.d.ts). Private helpers are left untyped.
 * - Named export `decodeUriComponent` instead of a default export.
 * - Reformatted with the repo Prettier config.
 */

// Matches one or more consecutive percent-encoded bytes (e.g. `%C3%A5`).
const token = '%[a-f0-9]{2}';
const multiMatcher = new RegExp(`(${token})+`, 'gi');

const hexPair = /^[a-f\d]{2}$/i;

// Read a `%XX` sequence at `position`, returning the byte value and where to continue scanning.
function parsePercentByte(input, position) {
    if (input.codePointAt(position) !== 37 || position + 3 > input.length) {
        return;
    }

    const digits = input.slice(position + 1, position + 3);

    if (!hexPair.test(digits)) {
        return;
    }

    return { byte: Number.parseInt(digits, 16), next: position + 3 };
}

/**
 * Return how many bytes a UTF-8 code point needs based on its lead byte.
 * Returns 0 for continuation bytes and other invalid lead bytes.
 */
function utf8SequenceLength(byte) {
    if (byte <= 0x7f) {
        return 1;
    }

    // Start at 0xC2 to exclude overlong 2-byte encodings (0xC0/0xC1).
    if (byte >= 0xc2 && byte <= 0xdf) {
        return 2;
    }

    if (byte >= 0xe0 && byte <= 0xef) {
        return 3;
    }

    if (byte >= 0xf0 && byte <= 0xf4) {
        return 4;
    }

    return 0;
}

function isContinuationByte(byte) {
    return byte >= 0x80 && byte <= 0xbf;
}

/**
 * Decode as much of `input` as possible without throwing.
 *Scans left-to-right in O(n), decoding valid UTF-8 runs and leaving the rest literal.
 */
function decode(input) {
    try {
        return decodeURIComponent(input);
    } catch {
        let output = '';
        let position = 0;

        while (position < input.length) {
            if (input.codePointAt(position) !== 37) {
                output += input.charAt(position);
                position++;
                continue;
            }

            const firstByte = parsePercentByte(input, position);

            // `%` not followed by two hex digits (e.g. `%` or `%G`).
            if (!firstByte) {
                output += input.charAt(position);
                position++;
                continue;
            }

            const sequenceLength = utf8SequenceLength(firstByte.byte);

            // Continuation byte or invalid lead byte — emit one `%XX` literally.
            if (sequenceLength === 0) {
                output += input.slice(position, position + 3);
                position += 3;
                continue;
            }

            let end = firstByte.next;
            let validSequence = true;

            for (let index = 1; index < sequenceLength; index++) {
                const nextByte = parsePercentByte(input, end);

                if (!nextByte || !isContinuationByte(nextByte.byte)) {
                    validSequence = false;
                    break;
                }

                end = nextByte.next;
            }

            if (validSequence) {
                const encodedSequence = input.slice(position, end);

                try {
                    output += decodeURIComponent(encodedSequence);
                    position = end;
                    continue;
                } catch {
                    // Invalid UTF-8 despite correct structure — emit the first byte literally.
                }
            }

            // Missing continuation bytes or decode failure — emit the first byte literally.
            output += input.slice(position, position + 3);
            position += 3;
        }

        return output;
    }
}

function customDecodeURIComponent(input) {
    // Keep track of all the replacements and prefill the map with the `BOM`
    const replaceMap = {
        '%FE%FF': '\uFFFD\uFFFD',
        '%FF%FE': '\uFFFD\uFFFD',
    };

    // Find percent-encoded runs separated by literal text or lone `%` characters.
    let match = multiMatcher.exec(input);

    while (match) {
        try {
            // Decode as big chunks as possible
            replaceMap[match[0]] = decodeURIComponent(match[0]);
        } catch {
            const result = decode(match[0]);

            if (result !== match[0]) {
                replaceMap[match[0]] = result;
            }
        }

        match = multiMatcher.exec(input);
    }

    // Add `%C2` at the end of the map to make sure it does not replace the combinator before everything else
    replaceMap['%C2'] = '\uFFFD';

    const entries = Object.keys(replaceMap);

    for (const key of entries) {
        // Replace all decoded components
        input = input.replace(new RegExp(key, 'g'), replaceMap[key]);
    }

    return input;
}

export function decodeUriComponent(encodedURI: string): string {
    if (typeof encodedURI !== 'string') {
        throw new TypeError(
            `Expected \`encodedURI\` to be of type \`string\`, got \`${typeof encodedURI}\``
        );
    }

    try {
        // Try the built in decoder first
        return decodeURIComponent(encodedURI);
    } catch {
        // Fallback to a more advanced decoder
        return customDecodeURIComponent(encodedURI);
    }
}
