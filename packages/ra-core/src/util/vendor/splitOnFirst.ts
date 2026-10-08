/**
 * Vendored from split-on-first@3.0.0 (https://github.com/sindresorhus/split-on-first)
 * Source: index.js at tag v3.0.0
 *
 * MIT License
 *
 * Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
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
 * - Converted to TypeScript: typed the parameters and the return type
 *   (`[] | [string, string]`, matching what the function actually returns).
 * - Named export `splitOnFirst` instead of a default export.
 * - Reformatted with the repo Prettier config.
 */
export function splitOnFirst(
    string: string,
    separator: string
): [] | [string, string] {
    if (!(typeof string === 'string' && typeof separator === 'string')) {
        throw new TypeError('Expected the arguments to be of type `string`');
    }

    if (string === '' || separator === '') {
        return [];
    }

    const separatorIndex = string.indexOf(separator);

    if (separatorIndex === -1) {
        return [];
    }

    return [
        string.slice(0, separatorIndex),
        string.slice(separatorIndex + separator.length),
    ];
}
