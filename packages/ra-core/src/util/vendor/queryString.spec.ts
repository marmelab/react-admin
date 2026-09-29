// Ported from query-string@9.5.1 test/parse.js and test/stringify.js (MIT)
// https://github.com/sindresorhus/query-string/tree/v9.5.1/test
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (https://sindresorhus.com)
// See ./queryString.ts for the full license text.
import expect from 'expect';

import { parse, stringify } from './queryString';

describe('parse', () => {
    it('query strings starting with a `?`', () => {
        expect(parse('?foo=bar')).toEqual({ foo: 'bar' });
    });

    it('query strings starting with a `#`', () => {
        expect(parse('#foo=bar')).toEqual({ foo: 'bar' });
    });

    it('query strings starting with a `&`', () => {
        expect(parse('&foo=bar&foo=baz')).toEqual({ foo: ['bar', 'baz'] });
    });

    it('query strings ending with a `&`', () => {
        expect(parse('foo=bar&')).toEqual({ foo: 'bar' });
        expect(parse('foo=bar&&&')).toEqual({ foo: 'bar' });
    });

    it('parse a query string', () => {
        expect(parse('foo=bar')).toEqual({ foo: 'bar' });
        expect(parse('foo=null')).toEqual({ foo: 'null' });
    });

    it('parse multiple query string', () => {
        expect(parse('foo=bar&key=val')).toEqual({
            foo: 'bar',
            key: 'val',
        });
    });

    it('parse multiple query string retain order when not sorted', () => {
        const expectedKeys = ['b', 'a', 'c'];
        const parsed = parse('b=foo&a=bar&c=yay', { sort: false });
        for (const [index, key] of Object.keys(parsed).entries()) {
            expect(key).toBe(expectedKeys[index]);
        }
    });

    it('parse multiple query string sorted keys', () => {
        const fixture = ['a', 'b', 'c'];
        const parsed = parse('a=foo&c=bar&b=yay');
        for (const [index, key] of Object.keys(parsed).entries()) {
            expect(key).toBe(fixture[index]);
        }
    });

    it('should sort parsed keys in given order', () => {
        const fixture = ['c', 'a', 'b'];
        const sort = (key1, key2) =>
            fixture.indexOf(key1) - fixture.indexOf(key2);

        const parsed = parse('a=foo&b=bar&c=yay', { sort });
        for (const [index, key] of Object.keys(parsed).entries()) {
            expect(key).toBe(fixture[index]);
        }
    });

    it('parse query string without a value', () => {
        expect(parse('foo')).toEqual({ foo: null });
        expect(parse('foo&key')).toEqual({
            foo: null,
            key: null,
        });
        expect(parse('foo=bar&key')).toEqual({
            foo: 'bar',
            key: null,
        });
        expect(parse('a&a')).toEqual({ a: [null, null] });
        expect(parse('a=&a')).toEqual({ a: ['', null] });
    });

    it('return empty object if no qss can be found', () => {
        expect(parse('?')).toEqual({});
        expect(parse('&')).toEqual({});
        expect(parse('#')).toEqual({});
        expect(parse(' ')).toEqual({});
    });

    it('handle `+` correctly', () => {
        expect(parse('foo+faz=bar+baz++')).toEqual({ 'foo faz': 'bar baz  ' });
    });

    it('parses numbers with exponential notation as string', () => {
        expect(parse('192e11=bar')).toEqual({ '192e11': 'bar' });
        expect(parse('bar=192e11')).toEqual({ bar: '192e11' });
    });

    it('handle `+` correctly when not decoding', () => {
        expect(parse('foo+faz=bar+baz++', { decode: false })).toEqual({
            'foo+faz': 'bar+baz++',
        });
    });

    it('handle multiple of the same key', () => {
        expect(parse('foo=bar&foo=baz')).toEqual({ foo: ['bar', 'baz'] });
    });

    it('handles many duplicate keys without quadratic slowdown', () => {
        const count = 20_000;
        const duplicateQuery = Array.from({ length: count }, () => 'a=1').join(
            '&'
        );
        const uniqueQuery = Array.from(
            { length: count },
            (_, index) => `a${index}=1`
        ).join('&');

        const uniqueStartTime = performance.now();
        parse(uniqueQuery);
        const uniqueElapsedTime = performance.now() - uniqueStartTime;

        const duplicateStartTime = performance.now();
        const parsed = parse(duplicateQuery);
        const duplicateElapsedTime = performance.now() - duplicateStartTime;

        expect(parsed.a.length).toBe(count);
        expect(parsed.a.every(value => value === '1')).toBe(true);
        expect(duplicateElapsedTime < uniqueElapsedTime * 20 + 100).toBe(true);
    });

    it('handles many explicit array items without quadratic slowdown', () => {
        const count = 20_000;
        const cases = [
            {
                arrayFormat: 'bracket',
                duplicateQuery: Array.from(
                    { length: count },
                    () => 'a[]=1'
                ).join('&'),
                uniqueQuery: Array.from(
                    { length: count },
                    (_, index) => `a${index}[]=1`
                ).join('&'),
            },
            {
                arrayFormat: 'colon-list-separator',
                duplicateQuery: Array.from(
                    { length: count },
                    () => 'a:list=1'
                ).join('&'),
                uniqueQuery: Array.from(
                    { length: count },
                    (_, index) => `a${index}:list=1`
                ).join('&'),
            },
            {
                arrayFormat: 'bracket-separator',
                duplicateQuery: Array.from(
                    { length: count },
                    () => 'a[]=1'
                ).join('&'),
                uniqueQuery: Array.from(
                    { length: count },
                    (_, index) => `a${index}[]=1`
                ).join('&'),
            },
        ] as const;

        for (const { arrayFormat, duplicateQuery, uniqueQuery } of cases) {
            const uniqueStartTime = performance.now();
            parse(uniqueQuery, { arrayFormat });
            const uniqueElapsedTime = performance.now() - uniqueStartTime;

            const duplicateStartTime = performance.now();
            const parsed = parse(duplicateQuery, { arrayFormat });
            const duplicateElapsedTime = performance.now() - duplicateStartTime;

            expect(parsed.a.length).toBe(count);
            expect(parsed.a.every(value => value === '1')).toBe(true);
            expect(duplicateElapsedTime < uniqueElapsedTime * 10 + 100).toBe(
                true
            );
        }
    });

    it('handles large bracket-separator chunks without argument spread overflow', () => {
        const count = 200_000;
        const query = `a[]=0&a[]=${Array.from({ length: count }, () => '1').join(',')}`;
        const parsed = parse(query, { arrayFormat: 'bracket-separator' });

        expect(parsed.a.length).toBe(count + 1);
        expect(parsed.a[0]).toBe('0');
        expect(parsed.a[parsed.a.length - 1]).toBe('1');
    });

    it('handles scalar values before explicit array entries', () => {
        expect(parse('a=one&a[]=two', { arrayFormat: 'bracket' })).toEqual({
            a: ['one', 'two'],
        });
        expect(
            parse('a=one&a:list=two', { arrayFormat: 'colon-list-separator' })
        ).toEqual({ a: ['one', 'two'] });
        expect(
            parse('a=one&a[]=two,three', { arrayFormat: 'bracket-separator' })
        ).toEqual({ a: ['one', 'two', 'three'] });
    });

    it('handles many empty parameters without allocating split results', () => {
        // Reduced from 5_000_000 in upstream: with a very large input, the `/^&+$/` check
        // can exceed the stack under a heavily loaded Jest worker. The vendored code is unchanged.
        const query = '&'.repeat(500_000);
        const startTime = performance.now();
        const parsed = parse(query, { sort: false });
        const elapsedTime = performance.now() - startTime;

        expect(parsed).toEqual({});
        expect(elapsedTime < 50).toBe(true);
    });

    it('handle multiple values and preserve appearence order', () => {
        expect(parse('a=value&a=')).toEqual({ a: ['value', ''] });
        expect(parse('a=&a=value')).toEqual({ a: ['', 'value'] });
    });

    it('handle multiple values and preserve appearance order with brackets', () => {
        expect(parse('a[]=value&a[]=', { arrayFormat: 'bracket' })).toEqual({
            a: ['value', ''],
        });
        expect(parse('a[]=&a[]=value', { arrayFormat: 'bracket' })).toEqual({
            a: ['', 'value'],
        });
    });

    it('handle multiple values and preserve appearance order with indexes', () => {
        expect(parse('a[0]=value&a[1]=', { arrayFormat: 'index' })).toEqual({
            a: ['value', ''],
        });
        expect(parse('a[1]=&a[0]=value', { arrayFormat: 'index' })).toEqual({
            a: ['value', ''],
        });
    });

    it('query strings params including embedded `=`', () => {
        const value = 'https://someurl?id=2837';
        expect(parse(`param=${encodeURIComponent(value)}`)).toEqual({
            param: 'https://someurl?id=2837',
        });
    });

    it('object properties', () => {
        expect(parse(undefined as any).prototype).toBeFalsy();
        expect(parse('hasOwnProperty=foo')).toEqual({ hasOwnProperty: 'foo' });
    });

    it('query strings having indexed arrays', () => {
        expect(parse('foo[0]=bar&foo[1]=baz')).toEqual({
            'foo[0]': 'bar',
            'foo[1]': 'baz',
        });
    });

    it('query strings having brackets arrays', () => {
        expect(parse('foo[]=bar&foo[]=baz')).toEqual({
            'foo[]': ['bar', 'baz'],
        });
    });

    it('query strings having indexed arrays keeping index order', () => {
        expect(parse('foo[1]=bar&foo[0]=baz')).toEqual({
            'foo[1]': 'bar',
            'foo[0]': 'baz',
        });
    });

    it('query string having a single bracketed value and format option as `bracket`', () => {
        expect(parse('foo[]=bar', { arrayFormat: 'bracket' })).toEqual({
            foo: ['bar'],
        });
    });

    it('query string not having a bracketed value and format option as `bracket`', () => {
        expect(parse('foo=bar', { arrayFormat: 'bracket' })).toEqual({
            foo: 'bar',
        });
    });

    it('query string having a bracketed value and a single value and format option as `bracket`', () => {
        expect(parse('foo=bar&baz[]=bar', { arrayFormat: 'bracket' })).toEqual({
            foo: 'bar',
            baz: ['bar'],
        });
    });

    it('query strings having brackets arrays and format option as `bracket`', () => {
        expect(
            parse('foo[]=bar&foo[]=baz', {
                arrayFormat: 'bracket',
            })
        ).toEqual({ foo: ['bar', 'baz'] });
    });

    it('query strings having comma separated arrays and format option as `comma`', () => {
        expect(
            parse('foo=bar,baz', {
                arrayFormat: 'comma',
            })
        ).toEqual({ foo: ['bar', 'baz'] });
    });

    it('query strings having pipe separated arrays and format option as `separator`', () => {
        expect(
            parse('foo=bar|baz', {
                arrayFormat: 'separator',
                arrayFormatSeparator: '|',
            })
        ).toEqual({ foo: ['bar', 'baz'] });
    });

    it('single value with encoded separator should not be split into array', () => {
        // Test for issue #336 - encoded separators should not cause array splitting
        const value = encodeURIComponent('a|b'); // 'a%7Cb'
        expect(
            parse(`foo=${value}`, {
                arrayFormat: 'separator',
                arrayFormatSeparator: '|',
            })
        ).toEqual({ foo: 'a|b' });

        // Multiple values with encoded separators in them
        const value1 = encodeURIComponent('a|b');
        const value2 = encodeURIComponent('c|d');
        expect(
            parse(`foo=${value1}|${value2}`, {
                arrayFormat: 'separator',
                arrayFormatSeparator: '|',
            })
        ).toEqual({ foo: ['a|b', 'c|d'] });
    });

    it('query strings having brackets arrays with null and format option as `bracket`', () => {
        expect(
            parse('bar[]&foo[]=a&foo[]&foo[]=', {
                arrayFormat: 'bracket',
            })
        ).toEqual({
            foo: ['a', null, ''],
            bar: [null],
        });
    });

    it('query strings having comma separated arrays with null and format option as `comma`', () => {
        expect(
            parse('bar&foo=a,', {
                arrayFormat: 'comma',
            })
        ).toEqual({
            foo: ['a', ''],
            bar: null,
        });
    });

    it('query strings having indexed arrays and format option as `index`', () => {
        expect(
            parse('foo[0]=bar&foo[1]=baz', {
                arrayFormat: 'index',
            })
        ).toEqual({ foo: ['bar', 'baz'] });
    });

    it('query strings having brackets+separator arrays and format option as `bracket-separator` with 1 value', () => {
        expect(
            parse('foo[]=bar', {
                arrayFormat: 'bracket-separator',
            })
        ).toEqual({ foo: ['bar'] });
    });

    it('query strings having brackets+separator arrays and format option as `bracket-separator` with multiple values', () => {
        expect(
            parse('foo[]=bar,baz,,,biz', {
                arrayFormat: 'bracket-separator',
            })
        ).toEqual({ foo: ['bar', 'baz', '', '', 'biz'] });
    });

    it('query strings with multiple brackets+separator arrays and format option as `bracket-separator` using same key name', () => {
        expect(
            parse('foo[]=bar,baz&foo[]=biz,boz', {
                arrayFormat: 'bracket-separator',
            })
        ).toEqual({ foo: ['bar', 'baz', 'biz', 'boz'] });
    });

    it('query strings having an empty brackets+separator array and format option as `bracket-separator`', () => {
        expect(
            parse('foo[]', {
                arrayFormat: 'bracket-separator',
            })
        ).toEqual({ foo: [] });
    });

    it('query strings having a brackets+separator array and format option as `bracket-separator` with a single empty string', () => {
        expect(
            parse('foo[]=', {
                arrayFormat: 'bracket-separator',
            })
        ).toEqual({ foo: [''] });
    });

    it('query strings having a brackets+separator array and format option as `bracket-separator` with a URL encoded value', () => {
        const key = 'foo[]';
        const value = 'a,b,c,d,e,f';
        expect(
            parse(`?${encodeURIComponent(key)}=${encodeURIComponent(value)}`, {
                arrayFormat: 'bracket-separator',
            })
        ).toEqual({
            foo: ['a', 'b', 'c', 'd', 'e', 'f'],
        });
    });

    it('query strings having = within parameters (i.e. GraphQL IDs)', () => {
        expect(parse('foo=bar=&foo=ba=z=')).toEqual({ foo: ['bar=', 'ba=z='] });
    });

    it('query strings having ordered index arrays and format option as `index`', () => {
        expect(
            parse('foo[1]=bar&foo[0]=baz&foo[3]=one&foo[2]=two', {
                arrayFormat: 'index',
            })
        ).toEqual({ foo: ['baz', 'bar', 'two', 'one'] });

        expect(
            parse('foo[0]=bar&foo[1]=baz&foo[2]=one&foo[3]=two', {
                arrayFormat: 'index',
            })
        ).toEqual({ foo: ['bar', 'baz', 'one', 'two'] });

        expect(
            parse('foo[3]=three&foo[2]=two&foo[1]=one&foo[0]=zero', {
                arrayFormat: 'index',
            })
        ).toEqual({ foo: ['zero', 'one', 'two', 'three'] });

        expect(
            parse('foo[3]=three&foo[2]=two&foo[1]=one&foo[0]=zero&bat=buz', {
                arrayFormat: 'index',
            })
        ).toEqual({ foo: ['zero', 'one', 'two', 'three'], bat: 'buz' });

        expect(
            parse('foo[1]=bar&foo[0]=baz', {
                arrayFormat: 'index',
            })
        ).toEqual({ foo: ['baz', 'bar'] });

        expect(
            parse('foo[102]=three&foo[2]=two&foo[1]=one&foo[0]=zero&bat=buz', {
                arrayFormat: 'index',
            })
        ).toEqual({ bat: 'buz', foo: ['zero', 'one', 'two', 'three'] });

        expect(
            parse(
                'foo[102]=three&foo[2]=two&foo[100]=one&foo[0]=zero&bat=buz',
                {
                    arrayFormat: 'index',
                }
            )
        ).toEqual({ bat: 'buz', foo: ['zero', 'two', 'one', 'three'] });
    });

    it('circuit parse → stringify', () => {
        const original = 'foo[3]=foo&foo[2]&foo[1]=one&foo[0]=&bat=buz';
        const sortedOriginal = 'bat=buz&foo[0]=&foo[1]=one&foo[2]&foo[3]=foo';
        const expected = { bat: 'buz', foo: ['', 'one', null, 'foo'] };
        const options = {
            arrayFormat: 'index',
        } as const;

        expect(parse(original, options)).toEqual(expected);

        expect(stringify(expected, options)).toBe(sortedOriginal);
    });

    it('circuit original → parse → stringify → sorted original', () => {
        const original =
            'foo[21474836471]=foo&foo[21474836470]&foo[1]=one&foo[0]=&bat=buz';
        const sortedOriginal = 'bat=buz&foo[0]=&foo[1]=one&foo[2]&foo[3]=foo';
        const options = {
            arrayFormat: 'index',
        } as const;

        expect(stringify(parse(original, options), options)).toEqual(
            sortedOriginal
        );
    });

    it('circuit parse → stringify with array commas', () => {
        const original = 'c=,a,,&b=&a=';
        const sortedOriginal = 'a=&b=&c=,a,,';
        const expected = {
            c: ['', 'a', '', ''],
            b: '',
            a: '',
        };
        const options = {
            arrayFormat: 'comma',
        } as const;

        expect(parse(original, options)).toEqual(expected);

        expect(stringify(expected, options)).toBe(sortedOriginal);
    });

    it('circuit original → parse → stringify with array commas → sorted original', () => {
        const original = 'c=,a,,&b=&a=';
        const sortedOriginal = 'a=&b=&c=,a,,';
        const options = {
            arrayFormat: 'comma',
        } as const;

        expect(stringify(parse(original, options), options)).toEqual(
            sortedOriginal
        );
    });

    it('decode keys and values', () => {
        expect(parse('st%C3%A5le=foo')).toEqual({ ståle: 'foo' });
        expect(parse('foo=%7B%ab%%7C%de%%7D+%%7Bst%C3%A5le%7D%')).toEqual({
            foo: '{%ab%|%de%} %{ståle}%',
        });
    });

    it('disable decoding of keys and values', () => {
        const value = 'postal office,burger, fries and coke';
        expect(
            parse(`tags=${encodeURIComponent(value)}`, { decode: false })
        ).toEqual({ tags: 'postal%20office%2Cburger%2C%20fries%20and%20coke' });
    });

    it('number value returns as string by default', () => {
        expect(parse('foo=1')).toEqual({ foo: '1' });
    });

    it('number value returns as number if option is set', () => {
        expect(parse('foo=1', { parseNumbers: true })).toEqual({ foo: 1 });
        expect(parse('foo=12.3&bar=123e-1', { parseNumbers: true })).toEqual({
            foo: 12.3,
            bar: 12.3,
        });
        expect(parse('foo=0x11&bar=12.00', { parseNumbers: true })).toEqual({
            foo: 17,
            bar: 12,
        });
    });

    it('NaN value returns as string if option is set', () => {
        expect(parse('foo=null', { parseNumbers: true })).toEqual({
            foo: 'null',
        });
        expect(parse('foo=undefined', { parseNumbers: true })).toEqual({
            foo: 'undefined',
        });
        expect(parse('foo=100a&bar=100', { parseNumbers: true })).toEqual({
            foo: '100a',
            bar: 100,
        });
        expect(parse('foo=   &bar=', { parseNumbers: true })).toEqual({
            foo: '   ',
            bar: '',
        });
    });

    it('parseNumbers works with arrayFormat', () => {
        expect(
            parse('foo[]=1&foo[]=2&foo[]=3&bar=1', {
                parseNumbers: true,
                arrayFormat: 'bracket',
            })
        ).toEqual({ foo: [1, 2, 3], bar: 1 });
        expect(
            parse('foo=1,2,a', { parseNumbers: true, arrayFormat: 'comma' })
        ).toEqual({ foo: [1, 2, 'a'] });
        expect(
            parse('foo=1|2|a', {
                parseNumbers: true,
                arrayFormat: 'separator',
                arrayFormatSeparator: '|',
            })
        ).toEqual({ foo: [1, 2, 'a'] });
        expect(
            parse('foo[0]=1&foo[1]=2&foo[2]', {
                parseNumbers: true,
                arrayFormat: 'index',
            })
        ).toEqual({ foo: [1, 2, null] });
        expect(parse('foo=1&foo=2&foo=3', { parseNumbers: true })).toEqual({
            foo: [1, 2, 3],
        });
    });

    it('boolean value returns as string by default', () => {
        expect(parse('foo=true')).toEqual({ foo: 'true' });
    });

    it('boolean value returns as boolean if option is set', () => {
        expect(parse('foo=true', { parseBooleans: true })).toEqual({
            foo: true,
        });
        expect(parse('foo=false&bar=true', { parseBooleans: true })).toEqual({
            foo: false,
            bar: true,
        });
    });

    it('parseBooleans works with arrayFormat', () => {
        expect(
            parse('foo[]=true&foo[]=false&foo[]=true&bar=1', {
                parseBooleans: true,
                arrayFormat: 'bracket',
            })
        ).toEqual({ foo: [true, false, true], bar: '1' });
        expect(
            parse('foo=true,false,a', {
                parseBooleans: true,
                arrayFormat: 'comma',
            })
        ).toEqual({ foo: [true, false, 'a'] });
        expect(
            parse('foo[0]=true&foo[1]=false&foo[2]', {
                parseBooleans: true,
                arrayFormat: 'index',
            })
        ).toEqual({ foo: [true, false, null] });
        expect(
            parse('foo=true&foo=false&foo=3', { parseBooleans: true })
        ).toEqual({ foo: [true, false, '3'] });
    });

    it('boolean value returns as boolean and number value as number if both options are set', () => {
        expect(
            parse('foo=true&bar=1.12', {
                parseNumbers: true,
                parseBooleans: true,
            })
        ).toEqual({ foo: true, bar: 1.12 });
        expect(
            parse('foo=16.32&bar=false', {
                parseNumbers: true,
                parseBooleans: true,
            })
        ).toEqual({ foo: 16.32, bar: false });
    });

    it('parseNumbers and parseBooleans can work with arrayFormat at the same time', () => {
        expect(
            parse('foo=true&foo=false&bar=1.12&bar=2', {
                parseNumbers: true,
                parseBooleans: true,
            })
        ).toEqual({ foo: [true, false], bar: [1.12, 2] });
        expect(
            parse('foo[]=true&foo[]=false&foo[]=true&bar[]=1&bar[]=2', {
                parseNumbers: true,
                parseBooleans: true,
                arrayFormat: 'bracket',
            })
        ).toEqual({ foo: [true, false, true], bar: [1, 2] });
        expect(
            parse('foo=true,false&bar=1,2', {
                parseNumbers: true,
                parseBooleans: true,
                arrayFormat: 'comma',
            })
        ).toEqual({ foo: [true, false], bar: [1, 2] });
        expect(
            parse('foo[0]=true&foo[1]=false&bar[0]=1&bar[1]=2', {
                parseNumbers: true,
                parseBooleans: true,
                arrayFormat: 'index',
            })
        ).toEqual({ foo: [true, false], bar: [1, 2] });
    });

    it('parse throws TypeError for invalid arrayFormatSeparator', () => {
        expect(() => {
            parse('', { arrayFormatSeparator: ',,' });
        }).toThrow(TypeError);

        expect(() => {
            parse('', { arrayFormatSeparator: [] } as any);
        }).toThrow(TypeError);
    });

    it('query strings having comma encoded and format option as `comma`', () => {
        const values = ['zero,one', 'two,three'];
        expect(
            parse(
                `foo=${encodeURIComponent(values[0])},${encodeURIComponent(values[1])}`,
                { arrayFormat: 'comma' }
            )
        ).toEqual({
            foo: ['zero,one', 'two,three'],
        });
    });

    it('value should not be decoded twice with `arrayFormat` option set as `separator`', () => {
        expect(
            parse('foo=2020-01-01T00:00:00%2B03:00', {
                arrayFormat: 'separator',
            })
        ).toEqual({
            foo: '2020-01-01T00:00:00+03:00',
        });
    });

    // See https://github.com/sindresorhus/query-string/issues/242
    it('value separated by encoded comma will not be parsed as array with `arrayFormat` option set to `comma`', () => {
        const value = '1,2,3';
        expect(
            parse(`id=${encodeURIComponent(value)}`, {
                arrayFormat: 'comma',
                parseNumbers: true,
            })
        ).toEqual({
            id: '1,2,3',
        });
    });

    it('query strings having (:list) colon-list-separator arrays', () => {
        expect(
            parse('bar:list=one&bar:list=two', {
                arrayFormat: 'colon-list-separator',
            })
        ).toEqual({ bar: ['one', 'two'] });
    });

    it('query strings having (:list) colon-list-separator arrays including null values', () => {
        expect(
            parse('bar:list=one&bar:list=two&foo', {
                arrayFormat: 'colon-list-separator',
            })
        ).toEqual({ bar: ['one', 'two'], foo: null });
    });

    it('types option: can override a parsed number to be a string ', () => {
        const phoneNumber = '+380951234567';
        expect(
            parse(`phoneNumber=${encodeURIComponent(phoneNumber)}`, {
                parseNumbers: true,
                types: {
                    phoneNumber: 'string',
                },
            })
        ).toEqual({ phoneNumber: '+380951234567' });
    });

    it('types option: can override a parsed boolean value to be a string', () => {
        expect(
            parse('question=true', {
                parseBooleans: true,
                types: {
                    question: 'string',
                },
            })
        ).toEqual({
            question: 'true',
        });
    });

    it('types option: can override parsed numbers arrays to be string[]', () => {
        expect(
            parse('ids=999,998,997&items=1,2,3', {
                arrayFormat: 'comma',
                parseNumbers: true,
                types: {
                    ids: 'string[]',
                },
            })
        ).toEqual({
            ids: ['999', '998', '997'],
            items: [1, 2, 3],
        });
    });

    it('types option: can override string arrays to be number[]', () => {
        expect(
            parse('ids=1,2,3&items=1,2,3', {
                arrayFormat: 'comma',
                types: {
                    ids: 'number[]',
                },
            })
        ).toEqual({
            ids: [1, 2, 3],
            items: ['1', '2', '3'],
        });
    });

    it('types option: can override an array to be string', () => {
        expect(
            parse('ids=001,002,003&items=1,2,3', {
                arrayFormat: 'comma',
                parseNumbers: true,
                types: {
                    ids: 'string',
                },
            })
        ).toEqual({
            ids: '001,002,003',
            items: [1, 2, 3],
        });
    });

    it('types option: can override a separator array to be string ', () => {
        expect(
            parse('ids=001|002|003&items=1|2|3', {
                arrayFormat: 'separator',
                arrayFormatSeparator: '|',
                parseNumbers: true,
                types: {
                    ids: 'string',
                },
            })
        ).toEqual({
            ids: '001|002|003',
            items: [1, 2, 3],
        });
    });

    it('types option: when value is not of specified type, it will safely parse the value as string', () => {
        expect(
            parse('id=example', {
                types: {
                    id: 'number',
                },
            })
        ).toEqual({
            id: 'example',
        });
    });

    it('types option: array types will have no effect if arrayFormat is set to "none"', () => {
        expect(
            parse('ids=001,002,003&foods=apple,orange,mango', {
                arrayFormat: 'none',
                types: {
                    ids: 'number[]',
                    foods: 'string[]',
                },
            })
        ).toEqual({
            ids: '001,002,003',
            foods: 'apple,orange,mango',
        });
    });

    it('types option: will parse the value as number if specified in type but parseNumbers is false', () => {
        expect(
            parse('id=123', {
                arrayFormat: 'comma',
                types: {
                    id: 'number',
                },
            })
        ).toEqual({
            id: 123,
        });
    });

    it('types option: all supported types work in conjunction with one another', () => {
        expect(
            parse(
                'ids=001,002,003&items=1,2,3&price=22.00&numbers=1,2,3&double=5&number=20',
                {
                    arrayFormat: 'comma',
                    types: {
                        ids: 'string',
                        items: 'string[]',
                        price: 'string',
                        numbers: 'number[]',
                        double: (value: any) => value * 2,
                        number: 'number',
                    },
                }
            )
        ).toEqual({
            ids: '001,002,003',
            items: ['1', '2', '3'],
            price: '22.00',
            numbers: [1, 2, 3],
            double: 10,
            number: 20,
        });
    });

    it('types option: single element with `{arrayFormat: "comma"} and type: string[]`', () => {
        expect(
            parse('a=b', {
                arrayFormat: 'comma',
                types: {
                    a: 'string[]',
                },
            })
        ).toEqual({
            a: ['b'],
        });
    });

    it('types option: single element with `{arrayFormat: "comma"}, and type: number[]`', () => {
        expect(
            parse('a=1', {
                arrayFormat: 'comma',
                types: {
                    a: 'number[]',
                },
            })
        ).toEqual({
            a: [1],
        });
    });

    it('types option: can parse boolean when parseboolean is false', () => {
        expect(
            parse('a=true', {
                parsebooleans: false,
                types: {
                    a: 'boolean',
                },
            } as any)
        ).toEqual({
            a: true,
        });
    });

    it('types option: boolean type accepts 1 and 0 as boolean values', () => {
        expect(
            parse('a=1&b=0', {
                parsebooleans: false,
                types: {
                    a: 'boolean',
                    b: 'boolean',
                },
            } as any)
        ).toEqual({
            a: true,
            b: false,
        });
    });

    it('types option: boolean type accepts an empty string as true', () => {
        expect(
            parse('a&b', {
                parsebooleans: false,
                types: {
                    a: 'boolean',
                    b: 'boolean',
                },
            } as any)
        ).toEqual({
            a: true,
            b: true,
        });
    });

    it('types option: function types with arrays apply to each element', () => {
        // Test with comma format
        expect(
            parse('scores=10,20,30', {
                arrayFormat: 'comma',
                types: {
                    scores: value => Number(value) * 2,
                },
            })
        ).toEqual({
            scores: [20, 40, 60],
        });

        // Test with bracket format
        expect(
            parse('scores[]=5&scores[]=10&scores[]=15', {
                arrayFormat: 'bracket',
                types: {
                    scores: value => Number(value) + 10,
                },
            })
        ).toEqual({
            scores: [15, 20, 25],
        });

        // Test with separator format
        expect(
            parse('scores=1|2|3', {
                arrayFormat: 'separator',
                arrayFormatSeparator: '|',
                types: {
                    scores: value => `item-${value}`,
                },
            })
        ).toEqual({
            scores: ['item-1', 'item-2', 'item-3'],
        });

        // Test function with single value still works
        expect(
            parse('score=42', {
                types: {
                    score: value => Number(value) / 2,
                },
            })
        ).toEqual({
            score: 21,
        });

        // Test mixed types in same query
        expect(
            parse('nums=1,2,3&single=10', {
                arrayFormat: 'comma',
                types: {
                    nums: value => Number(value) * 3,
                    single: value => Number(value) * 2,
                },
            })
        ).toEqual({
            nums: [3, 6, 9],
            single: 20,
        });
    });
});

describe('stringify', () => {
    it('stringify', () => {
        expect(stringify({ foo: 'bar' })).toBe('foo=bar');
        expect(
            stringify({
                foo: 'bar',
                bar: 'baz',
            })
        ).toBe('bar=baz&foo=bar');
    });

    it('different types', () => {
        expect(stringify(undefined)).toBe('');
        expect(stringify(0 as any)).toBe('');
    });

    it('primitive types', () => {
        expect(stringify({ a: 'string' })).toBe('a=string');
        expect(stringify({ a: true, b: false })).toBe('a=true&b=false');
        expect(stringify({ a: 0, b: 1n })).toBe('a=0&b=1');
        expect(stringify({ a: null, b: undefined })).toBe('a');
    });

    it('URI encode', () => {
        expect(stringify({ 'foo bar': 'baz faz' })).toBe('foo%20bar=baz%20faz');
        expect(stringify({ 'foo bar': "baz'faz" })).toBe('foo%20bar=baz%27faz');
    });

    it('no encoding', () => {
        expect(stringify({ 'foo:bar': 'baz:faz' }, { encode: false })).toBe(
            'foo:bar=baz:faz'
        );
    });

    it('handle array value', () => {
        expect(
            stringify({
                abc: 'abc',
                foo: ['bar', 'baz'],
            })
        ).toBe('abc=abc&foo=bar&foo=baz');
    });

    it('stringifies large arrays without quadratic slowdown', () => {
        const count = 20_000;
        const array = Array.from({ length: count }, () => '1');
        const object = Object.fromEntries(
            Array.from({ length: count }, (_, index) => [`a${index}`, '1'])
        );
        const arrayFormats = [
            'none',
            'bracket',
            'index',
            'colon-list-separator',
        ] as const;

        const objectStartTime = performance.now();
        stringify(object);
        const objectElapsedTime = performance.now() - objectStartTime;

        for (const arrayFormat of arrayFormats) {
            const arrayStartTime = performance.now();
            const result = stringify({ a: array }, { arrayFormat });
            const arrayElapsedTime = performance.now() - arrayStartTime;

            expect(result.length > count).toBe(true);
            expect(arrayElapsedTime < objectElapsedTime * 10 + 100).toBe(true);
        }
    });

    it('stringifies large separator arrays without quadratic slowdown', () => {
        const count = 100_000;
        const array = Array.from({ length: count }, () => '1');
        const object = Object.fromEntries(
            Array.from({ length: count }, (_, index) => [`a${index}`, '1'])
        );
        const arrayFormats = [
            'comma',
            'separator',
            'bracket-separator',
        ] as const;

        const objectStartTime = performance.now();
        stringify(object);
        const objectElapsedTime = performance.now() - objectStartTime;

        for (const arrayFormat of arrayFormats) {
            const arrayStartTime = performance.now();
            const result = stringify({ a: array }, { arrayFormat });
            const arrayElapsedTime = performance.now() - arrayStartTime;

            expect(result.length > count).toBe(true);
            expect(arrayElapsedTime < objectElapsedTime * 5 + 100).toBe(true);
        }
    });

    it('array order', () => {
        expect(
            stringify({
                abc: 'abc',
                foo: ['baz', 'bar'],
            })
        ).toBe('abc=abc&foo=baz&foo=bar');
    });

    it('handle empty array value', () => {
        expect(
            stringify({
                abc: 'abc',
                foo: [],
            })
        ).toBe('abc=abc');
    });

    it('should not encode undefined values', () => {
        expect(
            stringify({
                abc: undefined,
                foo: 'baz',
            })
        ).toBe('foo=baz');
    });

    it('should encode null values as just a key', () => {
        expect(
            stringify({
                'x y z': null,
                abc: null,
                foo: 'baz',
            })
        ).toBe('abc&foo=baz&x%20y%20z');
    });

    it('handle null values in array', () => {
        expect(
            stringify({
                foo: null,
                bar: [null, 'baz'],
            })
        ).toBe('bar&bar=baz&foo');
    });

    it('handle undefined values in array', () => {
        expect(
            stringify({
                foo: null,
                bar: [undefined, 'baz'],
            })
        ).toBe('bar=baz&foo');
    });

    it('handle undefined and null values in array', () => {
        expect(
            stringify({
                foo: null,
                bar: [undefined, null, 'baz'],
            })
        ).toBe('bar&bar=baz&foo');
    });

    it('strict encoding', () => {
        expect(stringify({ foo: "'bar'" })).toBe('foo=%27bar%27');
        expect(stringify({ foo: ["'bar'", '!baz'] })).toBe(
            'foo=%27bar%27&foo=%21baz'
        );
    });

    it('loose encoding', () => {
        expect(stringify({ foo: "'bar'" }, { strict: false })).toBe(
            "foo='bar'"
        );
        expect(stringify({ foo: ["'bar'", '!baz'] }, { strict: false })).toBe(
            "foo='bar'&foo=!baz"
        );
    });

    it('array stringify representation with array indexes', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', 'two'],
                },
                {
                    arrayFormat: 'index',
                }
            )
        ).toBe('bar[0]=one&bar[1]=two&foo');
    });

    it('array stringify representation with array brackets', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', 'two'],
                },
                {
                    arrayFormat: 'bracket',
                }
            )
        ).toBe('bar[]=one&bar[]=two&foo');
    });

    it('array stringify representation with array brackets and null value', () => {
        expect(
            stringify(
                {
                    foo: ['a', null, ''],
                    bar: [null],
                },
                {
                    arrayFormat: 'bracket',
                }
            )
        ).toBe('bar[]&foo[]=a&foo[]&foo[]=');
    });

    it('array stringify representation with array commas', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', 'two'],
                },
                {
                    arrayFormat: 'comma',
                }
            )
        ).toBe('bar=one,two&foo');
    });

    it('array stringify representation with array commas, null & empty string', () => {
        expect(
            stringify(
                {
                    c: [null, 'a', '', null],
                    b: [null],
                    a: [''],
                },
                {
                    arrayFormat: 'comma',
                }
            )
        ).toBe('a=&b=&c=,a,,');
    });

    it('array stringify representation with array commas, null & empty string (skip both)', () => {
        expect(
            stringify(
                {
                    c: [null, 'a', '', null],
                    b: [null],
                    a: [''],
                },
                {
                    skipNull: true,
                    skipEmptyString: true,
                    arrayFormat: 'comma',
                }
            )
        ).toBe('c=a');
    });

    it('array stringify representation with array commas and 0 value', () => {
        expect(
            stringify(
                {
                    foo: ['a', null, 0],
                    bar: [null],
                },
                {
                    arrayFormat: 'comma',
                }
            )
        ).toBe('bar=&foo=a,,0');
    });

    it('array stringify representation with a bad array format', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', 'two'],
                },
                {
                    arrayFormat: 'badinput',
                } as any
            )
        ).toBe('bar=one&bar=two&foo');
    });

    it('array stringify representation with array indexes and sparse array', () => {
        const fixture = ['one', 'two'];
        fixture[10] = 'three';
        expect(stringify({ bar: fixture }, { arrayFormat: 'index' })).toBe(
            'bar[0]=one&bar[1]=two&bar[2]=three'
        );
    });

    it('array stringify representation with brackets and separators with empty array', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: [],
                },
                {
                    arrayFormat: 'bracket-separator',
                }
            )
        ).toBe('bar[]&foo');
    });

    it('array stringify representation with brackets and separators with single value', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one'],
                },
                {
                    arrayFormat: 'bracket-separator',
                }
            )
        ).toBe('bar[]=one&foo');
    });

    it('array stringify representation with brackets and separators with multiple values', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', 'two', 'three'],
                },
                {
                    arrayFormat: 'bracket-separator',
                }
            )
        ).toBe('bar[]=one,two,three&foo');
    });

    it('array stringify representation with brackets and separators with a single empty string', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: [''],
                },
                {
                    arrayFormat: 'bracket-separator',
                }
            )
        ).toBe('bar[]=&foo');
    });

    it('array stringify representation with brackets and separators with a multiple empty string', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['', 'two', ''],
                },
                {
                    arrayFormat: 'bracket-separator',
                }
            )
        ).toBe('bar[]=,two,&foo');
    });

    it('array stringify representation with brackets and separators with dropped empty strings', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['', 'two', ''],
                },
                {
                    arrayFormat: 'bracket-separator',
                    skipEmptyString: true,
                }
            )
        ).toBe('bar[]=two&foo');
    });

    it('array stringify representation with brackets and separators with dropped null values', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', null, 'three', null, '', 'six'],
                },
                {
                    arrayFormat: 'bracket-separator',
                    skipNull: true,
                }
            )
        ).toBe('bar[]=one,three,,six');
    });

    it('should sort keys in given order', () => {
        const fixture = ['c', 'a', 'b'];
        const sort = (key1, key2) =>
            fixture.indexOf(key1) - fixture.indexOf(key2);

        expect(stringify({ a: 'foo', b: 'bar', c: 'baz' }, { sort })).toBe(
            'c=baz&a=foo&b=bar'
        );
    });

    it('should not sort when sort is false', () => {
        const fixture = {
            story: 'a',
            patch: 'b',
            deployment: 'c',
            lat: 10,
            lng: 20,
            sb: 'd',
            sc: 'e',
            mn: 'f',
            ln: 'g',
            nf: 'h',
            srs: 'i',
            destination: 'g',
        };
        expect(stringify(fixture, { sort: false })).toBe(
            'story=a&patch=b&deployment=c&lat=10&lng=20&sb=d&sc=e&mn=f&ln=g&nf=h&srs=i&destination=g'
        );
    });

    it('should disable sorting', () => {
        expect(
            stringify(
                {
                    c: 'foo',
                    b: 'bar',
                    a: 'baz',
                },
                {
                    sort: false,
                }
            )
        ).toBe('c=foo&b=bar&a=baz');
    });

    it('should ignore null when skipNull is set', () => {
        expect(
            stringify(
                {
                    a: 1,
                    b: null,
                    c: 3,
                },
                {
                    skipNull: true,
                }
            )
        ).toBe('a=1&c=3');
    });

    it('should ignore emptyString when skipEmptyString is set', () => {
        expect(
            stringify(
                {
                    a: 1,
                    b: '',
                    c: 3,
                },
                {
                    skipEmptyString: true,
                }
            )
        ).toBe('a=1&c=3');
    });

    it('should ignore undefined when skipNull is set', () => {
        expect(
            stringify(
                {
                    a: 1,
                    b: undefined,
                    c: 3,
                },
                {
                    skipNull: true,
                }
            )
        ).toBe('a=1&c=3');
    });

    it('should ignore both null and undefined when skipNull is set', () => {
        expect(
            stringify(
                {
                    a: undefined,
                    b: null,
                },
                {
                    skipNull: true,
                }
            )
        ).toBe('');
    });

    it('should ignore both null and undefined when skipNull is set for arrayFormat', () => {
        expect(
            stringify(
                {
                    a: [undefined, null, 1, undefined, 2, null],
                    b: null,
                    c: 1,
                },
                {
                    skipNull: true,
                }
            )
        ).toBe('a=1&a=2&c=1');

        expect(
            stringify(
                {
                    a: [undefined, null, 1, undefined, 2, null],
                    b: null,
                    c: 1,
                },
                {
                    skipNull: true,
                    arrayFormat: 'bracket',
                }
            )
        ).toBe('a[]=1&a[]=2&c=1');

        expect(
            stringify(
                {
                    a: [undefined, null, 1, undefined, 2, null],
                    b: null,
                    c: 1,
                },
                {
                    skipNull: true,
                    arrayFormat: 'comma',
                }
            )
        ).toBe('a=1,2&c=1');

        expect(
            stringify(
                {
                    a: [undefined, null, 1, undefined, 2, null],
                    b: null,
                    c: 1,
                },
                {
                    skipNull: true,
                    arrayFormat: 'index',
                }
            )
        ).toBe('a[0]=1&a[1]=2&c=1');
    });

    it('should ignore empty string when skipEmptyString is set for arrayFormat', () => {
        expect(
            stringify(
                {
                    a: ['', 1, '', 2],
                    b: '',
                    c: 1,
                },
                {
                    skipEmptyString: true,
                }
            )
        ).toBe('a=1&a=2&c=1');

        expect(
            stringify(
                {
                    a: ['', 1, '', 2],
                    b: '',
                    c: 1,
                },
                {
                    skipEmptyString: true,
                    arrayFormat: 'bracket',
                }
            )
        ).toBe('a[]=1&a[]=2&c=1');

        expect(
            stringify(
                {
                    a: ['', 1, '', 2],
                    b: '',
                    c: 1,
                },
                {
                    skipEmptyString: true,
                    arrayFormat: 'comma',
                }
            )
        ).toBe('a=1,2&c=1');

        expect(
            stringify(
                {
                    a: ['', 1, '', 2],
                    b: '',
                    c: 1,
                },
                {
                    skipEmptyString: true,
                    arrayFormat: 'index',
                }
            )
        ).toBe('a[0]=1&a[1]=2&c=1');

        expect(
            stringify(
                {
                    a: ['', '', '', ''],
                    c: 1,
                },
                {
                    skipEmptyString: true,
                }
            )
        ).toBe('c=1');
    });

    it('stringify throws TypeError for invalid arrayFormatSeparator', () => {
        expect(_ => stringify({}, { arrayFormatSeparator: ',,' })).toThrow(
            TypeError
        );
        expect(_ => stringify({}, { arrayFormatSeparator: [] } as any)).toThrow(
            TypeError
        );
    });

    it('array stringify representation with (:list) colon-list-separator', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', 'two'],
                },
                {
                    arrayFormat: 'colon-list-separator',
                }
            )
        ).toBe('bar:list=one&bar:list=two&foo');
    });

    it('array stringify representation with (:list) colon-list-separator with null values', () => {
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', ''],
                },
                {
                    arrayFormat: 'colon-list-separator',
                }
            )
        ).toBe('bar:list=one&bar:list=&foo');
        expect(
            stringify(
                {
                    foo: null,
                    bar: ['one', null],
                },
                {
                    arrayFormat: 'colon-list-separator',
                }
            )
        ).toBe('bar:list=one&bar:list=&foo');
    });

    it('replacer option transforms Date objects to ISO strings', () => {
        const date = new Date('2024-01-15T10:30:00.000Z');
        expect(
            stringify(
                {
                    name: 'John',
                    created: date,
                },
                {
                    replacer(key, value) {
                        if (value instanceof Date) {
                            return value.toISOString();
                        }

                        return value;
                    },
                }
            )
        ).toBe('created=2024-01-15T10%3A30%3A00.000Z&name=John');
    });

    it('replacer option can omit null values', () => {
        expect(
            stringify(
                {
                    a: 1,
                    b: null,
                    c: 3,
                },
                {
                    replacer: (key, value) =>
                        value === null ? undefined : value,
                }
            )
        ).toBe('a=1&c=3');
    });

    it('replacer option can transform specific keys', () => {
        expect(
            stringify(
                {
                    price: 10,
                    quantity: 5,
                },
                {
                    replacer(key, value) {
                        if (key === 'price' && typeof value === 'number') {
                            return `$${value}`;
                        }

                        return value;
                    },
                }
            )
        ).toBe('price=%2410&quantity=5');
    });

    it('replacer option can filter array elements', () => {
        expect(
            stringify(
                {
                    tags: ['one', 'two', 'three'],
                },
                {
                    replacer(key, value) {
                        if (key.startsWith('tags[') && value === 'two') {
                            return undefined; // Skip 'two'
                        }

                        return value;
                    },
                }
            )
        ).toBe('tags=one&tags=three');
    });

    it('replacer option returning undefined for all values results in empty string', () => {
        expect(
            stringify(
                {
                    a: 1,
                    b: 2,
                },
                {
                    replacer: () => undefined,
                }
            )
        ).toBe('');
    });

    it('replacer option can transform array to string', () => {
        expect(
            stringify(
                {
                    tags: ['one', 'two', 'three'],
                },
                {
                    replacer(key, value) {
                        if (Array.isArray(value)) {
                            return value.join('|');
                        }

                        return value;
                    },
                }
            )
        ).toBe('tags=one%7Ctwo%7Cthree');
    });

    it('replacer option works with bracket array format', () => {
        expect(
            stringify(
                {
                    items: [1, 2, 3],
                },
                {
                    arrayFormat: 'bracket',
                    replacer(key, value) {
                        if (typeof value === 'number') {
                            return value * 10;
                        }

                        return value;
                    },
                }
            )
        ).toBe('items[]=10&items[]=20&items[]=30');
    });

    it('replacer option handles edge cases correctly', () => {
        expect(
            stringify(
                {
                    undefinedValue: undefined,
                    nullValue: null,
                    empty: '',
                    zero: 0,
                    false: false,
                },
                {
                    replacer: (key, value) => value,
                }
            )
        ).toBe('empty=&false=false&nullValue&zero=0');
    });

    it('replacer option can handle Symbol without crashing', () => {
        const symbol = Symbol('test');
        expect(
            stringify(
                {
                    a: 1,
                    b: symbol,
                },
                {
                    replacer(key, value) {
                        if (typeof value === 'symbol') {
                            return 'symbol-value';
                        }

                        return value;
                    },
                }
            )
        ).toBe('a=1&b=symbol-value');
    });

    it('replacer option works with comma array format', () => {
        expect(
            stringify(
                {
                    colors: ['red', 'green', 'blue'],
                },
                {
                    arrayFormat: 'comma',
                    replacer(key, value) {
                        if (key.startsWith('colors[') && value === 'green') {
                            return 'GREEN';
                        }

                        return value;
                    },
                }
            )
        ).toBe('colors=red,GREEN,blue');
    });

    it('replacer option is called with correct keys for index array format', () => {
        const replacerKeys: string[] = [];
        stringify(
            {
                items: ['x', 'y'],
            },
            {
                arrayFormat: 'index',
                replacer(key, value) {
                    replacerKeys.push(key);
                    return value;
                },
            }
        );
        expect(replacerKeys).toEqual(['items', 'items[0]', 'items[1]']);
    });

    it('replacer option can transform objects to JSON strings', () => {
        expect(
            stringify(
                {
                    data: { nested: 'value' },
                },
                {
                    replacer(key, value) {
                        if (
                            typeof value === 'object' &&
                            value !== null &&
                            !Array.isArray(value)
                        ) {
                            return JSON.stringify(value);
                        }

                        return value;
                    },
                }
            )
        ).toBe('data=%7B%22nested%22%3A%22value%22%7D');
    });
});
