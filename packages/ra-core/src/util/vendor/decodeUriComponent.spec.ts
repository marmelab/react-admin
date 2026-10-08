// Ported from decode-uri-component@0.5.0 test.js (MIT)
// https://github.com/SamVerschueren/decode-uri-component/blob/v0.5.0/test.js
// Copyright (c) 2017, Sam Verschueren <sam.verschueren@gmail.com> (github.com/SamVerschueren)
// See ./decodeUriComponent.ts for the full license text.
import expect from 'expect';

import { decodeUriComponent } from './decodeUriComponent';

const tests = {
    test: 'test',
    'a+b': 'a+b',
    'a+b+c+d': 'a+b+c+d',
    '=a': '=a',
    '%': '%',
    '%25': '%',
    '%%25%%': '%%%%',
    'st%C3%A5le': 'ståle',
    'st%C3%A5le%': 'ståle%',
    '%st%C3%A5le%': '%ståle%',
    '%%7Bst%C3%A5le%7D%': '%{ståle}%',
    '%ab%C3%A5le%': '%abåle%',
    '%C3%A5%able%': 'å%able%',
    '%7B%ab%7C%de%7D': '{%ab|%de}',
    '%7B%ab%%7C%de%%7D': '{%ab%|%de%}',
    '%7 B%ab%%7C%de%%7 D': '%7 B%ab%|%de%%7 D',
    '%ab': '%ab',
    '%ab%ab%ab': '%ab%ab%ab',
    '%61+%4d%4D': 'a+MM',
    '\uFEFFtest2': '\uFEFFtest2',
    '\uFEFF': '\uFEFF',
    '%EF%BB%BFtest': '\uFEFFtest',
    '%EF%BB%BF': '\uFEFF',
    '%FE%FF': '\uFFFD\uFFFD',
    '%FF%FE': '\uFFFD\uFFFD',
    '†': '†',
    '%C2': '\uFFFD',
    '%C2x': '\uFFFDx',
    '%C2%B5': 'µ',
    '%C2%B5%': 'µ%',
    '%%C2%B5%': '%µ%',
    '%ea%ba%5a%ba': '%ea%baZ%ba',
    '%C3%5A%A5': '%C3Z%A5',
    '%C3%5A%A5%AB': '%C3Z%A5%AB',
};

// Valid inputs that should match native decodeURIComponent (fast path).
const validInputTests = {
    '': '',
    '%20': ' ',
    '%2B': '+',
    '%2b': '+',
    '%00': '\0',
    '%7F': '\u007F',
    '%09': '\t',
    '%0A': '\n',
    '%0D%0A': '\r\n',
    '%61%62%63': 'abc',
    '%2F%3F%23': '/?#',
    '%7E': '~',
    '%E2%80%A0': '†',
    '%F4%8F%BF%BF': '\u{10FFFF}',
    '%ED%9F%BF': '\u{D7FF}',
    '%F0%9F%98%80%F0%9F%98%81': '😀😁',
    '%2525': '%25',
    '%E4%BD%A0%E5%A5%BD': '你好',
    '%E4%BD%A0%20%E5%A5%BD%21\uFFFD\uFFFD': '你 好!\uFFFD\uFFFD',
    '%F0%9D%84%9E': '𝄞',
};

// Hex digits are case-insensitive.
const hexCaseTests = {
    '%c3%a5': 'å',
    '%C3%a5': 'å',
    '%7b%ab%7c%de%7d': '{%ab|%de}',
};

// Package-specific `%C2` truncation replacement behavior.
const c2ReplacementTests = {
    '%C2%41': '\uFFFDA',
    '%C2%C2': '\uFFFD\uFFFD',
    '%C2G5': '\uFFFDG5',
    'prefix%C2suffix': 'prefix\uFFFDsuffix',
    '%C3%A5%C2': 'å\uFFFD',
    '%C2%B5%C2': 'µ\uFFFD',
    '%C2%C2%B5': '\uFFFDµ',
    '%%C2%%': '%\uFFFD%%',
};

// Malformed UTF-8: sequences that look like multi-byte runs but cannot be decoded.
const invalidUtf8SequenceTests = {
    // Valid 4-byte sequence (control).
    '%F0%9F%98%80': '😀',

    // 4-byte lead without enough continuation bytes.
    '%F0%9F%98': '%F0%9F%98',
    '%F0%9F': '%F0%9F',
    '%F0': '%F0',

    // 4-byte lead with a non-continuation byte in the middle.
    '%F0%9F%41': '%F0%9FA',
    '%F0%41%82%83': '%F0A%82%83',

    // Lead bytes outside the valid 4-byte range (0xF5–0xFF).
    '%F5%80%80%80': '%F5%80%80%80',
    '%F8%88%88%88': '%F8%88%88%88',

    // Overlong 2-byte encodings (0xC0/0xC1 are never valid lead bytes).
    '%C0%AF': '%C0%AF',
    '%C1%BF': '%C1%BF',

    // 3-byte sequences: valid, truncated, and broken.
    '%E2%82%AC': '€',
    '%E2%82': '%E2%82',
    '%E2%41%AC': '%E2A%AC',
    '%E0%80%41': '%E0%80A',

    // UTF-8 encoding of a surrogate code point (invalid).
    '%ED%A0%80': '%ED%A0%80',

    // Continuation bytes without a lead byte.
    '%80': '%80',
    '%BF': '%BF',

    // 2-byte lead without a continuation byte.
    '%C3': '%C3',
    '%DF': '%DF',

    // 2-byte lead with an invalid continuation byte.
    '%C3%41': '%C3A',

    // Valid decode followed by invalid bytes.
    '%F0%9F%98%80%ab': '😀%ab',
    '%C3%A5%ab': 'å%ab',
};

// Valid UTF-8 structure but semantically invalid (inner catch in decode()).
const innerCatchTests = {
    '%E0%80%80': '%E0%80%80',
    '%E0%80%81': '%E0%80%81',
    '%F0%80%80%80': '%F0%80%80%80',
    '%F0%8F%BF%BF': '%F0%8F%BF%BF',
    '%E0%80%80%ab': '%E0%80%80%ab',
};

// Unicode scalar value boundaries.
const unicodeBoundaryTests = {
    '%ED%BF%BF': '%ED%BF%BF',
    '%F4%90%80%80': '%F4%90%80%80',
};

// Invalid percent-encoding syntax.
const invalidHexTests = {
    '%G0': '%G0',
    '%0G': '%0G',
    '%GG': '%GG',
    'foo%bar': 'foo%bar',
    '%u0041': '%u0041',
};

// Invalid lead bytes and orphaned continuation bytes.
const invalidLeadByteTests = {
    '%C1%88': '%C1%88',
    '%F9%80%80%80': '%F9%80%80%80',
    '%FA%80%80%80': '%FA%80%80%80',
    '%FB%80%80%80': '%FB%80%80%80',
    '%FC%80%80%80': '%FC%80%80%80',
    '%FD%80%80%80': '%FD%80%80%80',
    '%FE%80%80%80': '%FE%80%80%80',
    '%FF%80%80%80': '%FF%80%80%80',
    '%FF': '%FF',
    '%80%80%80': '%80%80%80',
};

// Mixed valid and invalid sequences in one string.
const mixedSequenceTests = {
    '%C3%A5%80%C3%A5': 'å%80å',
    '%G0%C3%A5%ab': '%G0å%ab',
    '%F0%9F%98%80%G0': '😀%G0',
    '%C3%A5%%C3%A5': 'å%å',
    '%ab%cd%ef': '%ab%cd%ef',
};

// UTF-16 BOM sequences embedded in larger strings.
const bomContextTests = {
    'a%FE%FFb': 'a\uFFFD\uFFFDb',
    '%FE%FF%FE%FF': '\uFFFD\uFFFD\uFFFD\uFFFD',
};

// Single-pass decoding (one level per call, not recursive).
const doubleEncodingTests = {
    '%252525': '%2525',
};

// Additional edge cases.
const miscTests = {
    '%%%': '%%%',
    '%25C2%25': '%C2%',
    '%2525C2': '%25C2',
};

// `%25` decodes to a literal `%`, which must act as a separator and never
// recombine with adjacent bytes (regression test for the old recursive decoder).
const percentSeparatorTests = {
    '%84%D7%25%88%90': '%84%D7%%88%90',
    '%20%20%25%80': '  %%80',
};

const invalidTypes: Record<string, [unknown, string]> = {
    undefined: [undefined, 'undefined'],
    null: [null, 'object'],
    number: [5, 'number'],
    'boolean true': [true, 'boolean'],
    'boolean false': [false, 'boolean'],
    'plain object': [{}, 'object'],
    array: [[], 'object'],
    symbol: [Symbol('x'), 'symbol'],
    bigint: [0n, 'bigint'],
    // Intentionally testing a boxed String object
    'boxed string': [new String('test'), 'object'],
    'object with toString': [{ toString: () => 'test%20' }, 'object'],
};

// Replaces the ava `macro`: one test per `input → expected` entry.
const testTable = table => {
    for (const input of Object.keys(table)) {
        it(`${input} → ${table[input]}`, () => {
            expect(decodeUriComponent(input)).toBe(table[input]);
        });
    }
};

describe('decodeUriComponent', () => {
    for (const [title, [value, type]] of Object.entries(invalidTypes)) {
        it(`type error: ${title}`, () => {
            expect(() => decodeUriComponent(value as any)).toThrow(
                new TypeError(
                    `Expected \`encodedURI\` to be of type \`string\`, got \`${type}\``
                )
            );
        });
    }

    it('decodes one level per call', () => {
        expect(decodeUriComponent('%2525')).toBe('%25');
        expect(decodeUriComponent('%25')).toBe('%');
    });

    it('idempotent when no percent-encoding remains', () => {
        const cases = ['%25', 'st%C3%A5le', '%C3%A5%ab', '%G0%C3%A5', '%'];

        for (const input of cases) {
            const once = decodeUriComponent(input);
            expect(decodeUriComponent(once)).toBe(once);
        }
    });

    testTable(tests);

    // Replaces the ava `parityMacro`: also checks parity with the native decodeURIComponent.
    describe('valid input', () => {
        const format = value => (value === '' ? '(empty)' : value);
        for (const input of Object.keys(validInputTests)) {
            it(`${format(input)} → ${format(validInputTests[input])}`, () => {
                expect(decodeUriComponent(input)).toBe(validInputTests[input]);
                expect(decodeUriComponent(input)).toBe(
                    decodeURIComponent(input)
                );
            });
        }
    });

    describe('hex case', () => {
        testTable(hexCaseTests);
    });

    describe('c2 replacement', () => {
        testTable(c2ReplacementTests);
    });

    describe('invalid utf-8 sequences', () => {
        testTable(invalidUtf8SequenceTests);
    });

    describe('inner catch', () => {
        testTable(innerCatchTests);
    });

    describe('unicode boundary', () => {
        testTable(unicodeBoundaryTests);
    });

    describe('invalid hex', () => {
        testTable(invalidHexTests);
    });

    describe('invalid lead byte', () => {
        testTable(invalidLeadByteTests);
    });

    describe('mixed sequence', () => {
        testTable(mixedSequenceTests);
    });

    describe('bom context', () => {
        testTable(bomContextTests);
    });

    describe('double encoding', () => {
        testTable(doubleEncodingTests);
    });

    describe('misc', () => {
        testTable(miscTests);
    });

    describe('percent separator', () => {
        testTable(percentSeparatorTests);
    });
});
