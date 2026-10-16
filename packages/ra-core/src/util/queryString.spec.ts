import expect from 'expect';

import { parseQueryString, stringifyQueryString } from './queryString';

describe('queryString', () => {
    describe('stringifyQueryString', () => {
        it('should stringify a simple object', () => {
            expect(stringifyQueryString({ foo: 'bar' })).toEqual('foo=bar');
        });

        it('should sort keys alphabetically', () => {
            expect(stringifyQueryString({ c: '3', a: '1', b: '2' })).toEqual(
                'a=1&b=2&c=3'
            );
        });

        it('should skip undefined values', () => {
            expect(
                stringifyQueryString({ a: '1', b: undefined, c: '3' })
            ).toEqual('a=1&c=3');
        });

        it('should render null values as a bare key', () => {
            expect(stringifyQueryString({ a: null, b: '2' })).toEqual('a&b=2');
        });

        it('should render arrays as repeated keys', () => {
            expect(stringifyQueryString({ id: [1, 2, 3] })).toEqual(
                'id=1&id=2&id=3'
            );
        });

        it('should skip undefined array items and render null items as a bare key', () => {
            expect(
                stringifyQueryString({ id: ['a', undefined, null, 'b'] })
            ).toEqual('id=a&id&id=b');
        });

        it('should ignore empty arrays', () => {
            expect(stringifyQueryString({ a: [], b: '2' })).toEqual('b=2');
        });

        it('should stringify numbers and booleans', () => {
            expect(
                stringifyQueryString({ page: 1, perPage: 0, active: false })
            ).toEqual('active=false&page=1&perPage=0');
        });

        it('should use strict URI encoding', () => {
            expect(stringifyQueryString({ q: "!'()*" })).toEqual(
                'q=%21%27%28%29%2A'
            );
        });

        it('should encode spaces as %20', () => {
            expect(stringifyQueryString({ q: 'a b' })).toEqual('q=a%20b');
        });

        it('should encode reserved characters in keys and values', () => {
            expect(stringifyQueryString({ 'a&b': 'c=d?e' })).toEqual(
                'a%26b=c%3Dd%3Fe'
            );
        });

        it('should encode unicode characters', () => {
            expect(stringifyQueryString({ q: 'héllo 中文' })).toEqual(
                'q=h%C3%A9llo%20%E4%B8%AD%E6%96%87'
            );
        });

        it('should encode JSON strings', () => {
            expect(
                stringifyQueryString({ filter: JSON.stringify({ q: 'a b' }) })
            ).toEqual('filter=%7B%22q%22%3A%22a%20b%22%7D');
        });

        it('should return an empty string for falsy input', () => {
            expect(stringifyQueryString(null)).toEqual('');
            expect(stringifyQueryString(undefined)).toEqual('');
            expect(stringifyQueryString({})).toEqual('');
        });

        it('should accept query-string options', () => {
            expect(
                stringifyQueryString({ a: [1, 2] }, { arrayFormat: 'bracket' })
            ).toEqual('a[]=1&a[]=2');
        });
    });

    describe('parseQueryString', () => {
        it('should parse a simple query string', () => {
            expect(parseQueryString('foo=bar')).toEqual({ foo: 'bar' });
        });

        it('should strip a leading ?, # or &', () => {
            expect(parseQueryString('?a=1')).toEqual({ a: '1' });
            expect(parseQueryString('#a=1')).toEqual({ a: '1' });
            expect(parseQueryString('&a=1')).toEqual({ a: '1' });
            expect(parseQueryString('  ?a=1  ')).toEqual({ a: '1' });
        });

        it('should decode + as a space', () => {
            expect(parseQueryString('q=a+b%20c')).toEqual({ q: 'a b c' });
        });

        it('should parse a key without = as null', () => {
            expect(parseQueryString('a&b=')).toEqual({ a: null, b: '' });
        });

        it('should only split on the first =', () => {
            expect(parseQueryString('a=1=2')).toEqual({ a: '1=2' });
        });

        it('should parse repeated keys as an array', () => {
            expect(parseQueryString('id=1&id=2&other=3&id')).toEqual({
                id: ['1', '2', null],
                other: '3',
            });
        });

        it('should ignore empty segments', () => {
            expect(parseQueryString('a=1&&b=2&')).toEqual({ a: '1', b: '2' });
        });

        it('should return keys in sorted order', () => {
            expect(Object.keys(parseQueryString('c=3&a=1&b=2'))).toEqual([
                'a',
                'b',
                'c',
            ]);
        });

        it('should decode encoded JSON', () => {
            expect(
                parseQueryString('filter=%7B%22q%22%3A%22foo%22%7D')
            ).toEqual({ filter: '{"q":"foo"}' });
        });

        it('should return an empty object for empty or non-string input', () => {
            expect(parseQueryString('')).toEqual({});
            expect(parseQueryString('?')).toEqual({});
            expect(parseQueryString(undefined as any)).toEqual({});
        });

        it('should not throw on malformed percent-encoded sequences', () => {
            expect(parseQueryString('a=%E0%A4%A')).toEqual({ a: '%E0%A4%A' });
            expect(parseQueryString('a=%')).toEqual({ a: '%' });
            expect(parseQueryString('a=%zz')).toEqual({ a: '%zz' });
            expect(parseQueryString('%=b')).toEqual({ '%': 'b' });
        });

        it('should decode the valid parts of a malformed string', () => {
            expect(parseQueryString('a=%41%E0%20%C3%A9%&b=%zz%20')).toEqual({
                a: 'A%E0 é%',
                b: '%zz ',
            });
        });

        it('should parse long malformed strings', () => {
            const value = '%E0%A4'.repeat(10000);
            expect(parseQueryString(`a=${value}`)).toEqual({ a: value });
        });

        it('should not pollute Object.prototype', () => {
            const parsed = parseQueryString('__proto__=x&constructor=y');
            expect(Object.getPrototypeOf(parsed)).toBeNull();
            expect(parsed['__proto__']).toEqual('x');
            expect(({} as any).x).toBeUndefined();
            expect(Object.prototype.hasOwnProperty('x')).toBe(false);
        });
    });

    it('should round-trip list params', () => {
        const params = {
            displayedFilters: JSON.stringify({ q: true, 'author.name': true }),
            filter: JSON.stringify({ q: "l'été & (co)", 'author.name': 'J*' }),
            order: 'DESC',
            page: '2',
            perPage: '25',
            sort: 'published_at',
        };
        expect(parseQueryString(`?${stringifyQueryString(params)}`)).toEqual(
            params
        );
    });
});
