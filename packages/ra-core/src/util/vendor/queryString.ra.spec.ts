import expect from 'expect';

import { parse, stringify } from './queryString';

describe('queryString', () => {
    describe('stringify', () => {
        it('should stringify a simple object', () => {
            expect(stringify({ foo: 'bar' })).toEqual('foo=bar');
        });

        it('should sort keys alphabetically', () => {
            expect(stringify({ c: '3', a: '1', b: '2' })).toEqual(
                'a=1&b=2&c=3'
            );
        });

        it('should skip undefined values', () => {
            expect(stringify({ a: '1', b: undefined, c: '3' })).toEqual(
                'a=1&c=3'
            );
        });

        it('should render null values as a bare key', () => {
            expect(stringify({ a: null, b: '2' })).toEqual('a&b=2');
        });

        it('should render arrays as repeated keys', () => {
            expect(stringify({ id: [1, 2, 3] })).toEqual('id=1&id=2&id=3');
        });

        it('should skip undefined array items and render null items as a bare key', () => {
            expect(stringify({ id: ['a', undefined, null, 'b'] })).toEqual(
                'id=a&id&id=b'
            );
        });

        it('should ignore empty arrays', () => {
            expect(stringify({ a: [], b: '2' })).toEqual('b=2');
        });

        it('should stringify numbers and booleans', () => {
            expect(stringify({ page: 1, perPage: 0, active: false })).toEqual(
                'active=false&page=1&perPage=0'
            );
        });

        it('should use strict URI encoding', () => {
            expect(stringify({ q: "!'()*" })).toEqual('q=%21%27%28%29%2A');
        });

        it('should encode spaces as %20', () => {
            expect(stringify({ q: 'a b' })).toEqual('q=a%20b');
        });

        it('should encode reserved characters in keys and values', () => {
            expect(stringify({ 'a&b': 'c=d?e' })).toEqual('a%26b=c%3Dd%3Fe');
        });

        it('should encode unicode characters', () => {
            expect(stringify({ q: 'héllo 中文' })).toEqual(
                'q=h%C3%A9llo%20%E4%B8%AD%E6%96%87'
            );
        });

        it('should encode JSON strings', () => {
            expect(stringify({ filter: JSON.stringify({ q: 'a b' }) })).toEqual(
                'filter=%7B%22q%22%3A%22a%20b%22%7D'
            );
        });

        it('should return an empty string for falsy input', () => {
            expect(stringify(null)).toEqual('');
            expect(stringify(undefined)).toEqual('');
            expect(stringify({})).toEqual('');
        });

        it('should accept query-string options', () => {
            expect(
                stringify({ a: [1, 2] }, { arrayFormat: 'bracket' })
            ).toEqual('a[]=1&a[]=2');
        });
    });

    describe('parse', () => {
        it('should parse a simple query string', () => {
            expect(parse('foo=bar')).toEqual({ foo: 'bar' });
        });

        it('should strip a leading ?, # or &', () => {
            expect(parse('?a=1')).toEqual({ a: '1' });
            expect(parse('#a=1')).toEqual({ a: '1' });
            expect(parse('&a=1')).toEqual({ a: '1' });
            expect(parse('  ?a=1  ')).toEqual({ a: '1' });
        });

        it('should decode + as a space', () => {
            expect(parse('q=a+b%20c')).toEqual({ q: 'a b c' });
        });

        it('should parse a key without = as null', () => {
            expect(parse('a&b=')).toEqual({ a: null, b: '' });
        });

        it('should only split on the first =', () => {
            expect(parse('a=1=2')).toEqual({ a: '1=2' });
        });

        it('should parse repeated keys as an array', () => {
            expect(parse('id=1&id=2&other=3&id')).toEqual({
                id: ['1', '2', null],
                other: '3',
            });
        });

        it('should ignore empty segments', () => {
            expect(parse('a=1&&b=2&')).toEqual({ a: '1', b: '2' });
        });

        it('should return keys in sorted order', () => {
            expect(Object.keys(parse('c=3&a=1&b=2'))).toEqual(['a', 'b', 'c']);
        });

        it('should decode encoded JSON', () => {
            expect(parse('filter=%7B%22q%22%3A%22foo%22%7D')).toEqual({
                filter: '{"q":"foo"}',
            });
        });

        it('should return an empty object for empty or non-string input', () => {
            expect(parse('')).toEqual({});
            expect(parse('?')).toEqual({});
            expect(parse(undefined as any)).toEqual({});
        });

        it('should not throw on malformed percent-encoded sequences', () => {
            expect(parse('a=%E0%A4%A')).toEqual({ a: '%E0%A4%A' });
            expect(parse('a=%')).toEqual({ a: '%' });
            expect(parse('a=%zz')).toEqual({ a: '%zz' });
            expect(parse('%=b')).toEqual({ '%': 'b' });
        });

        it('should decode the valid parts of a malformed string', () => {
            expect(parse('a=%41%E0%20%C3%A9%&b=%zz%20')).toEqual({
                a: 'A%E0 é%',
                b: '%zz ',
            });
        });

        it('should parse long malformed strings', () => {
            const value = '%E0%A4'.repeat(10000);
            expect(parse(`a=${value}`)).toEqual({ a: value });
        });

        it('should not pollute Object.prototype', () => {
            const parsed = parse('__proto__=x&constructor=y');
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
        expect(parse(`?${stringify(params)}`)).toEqual(params);
    });
});
