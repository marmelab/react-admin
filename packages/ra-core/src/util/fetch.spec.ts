import assert from 'assert';
import {
    createHeadersFromOptions,
    queryParameters,
    flattenObject,
} from './fetch';

describe('queryParameters', () => {
    it('should generate a query parameter', () => {
        const data = { foo: 'bar' };
        assert.equal(queryParameters(data), 'foo=bar');
    });

    it('should generate multiple query parameters', () => {
        const data = { foo: 'fooval', bar: 'barval' };
        const actual = queryParameters(data);
        assert(
            ['foo=fooval&bar=barval', 'bar=barval&foo=fooval'].includes(actual)
        );
    });

    it('should generate multiple query parameters with a same name', () => {
        const data = { foo: ['bar', 'baz'] };
        assert.equal(queryParameters(data), 'foo=bar&foo=baz');
    });

    it('should generate an encoded query parameter', () => {
        const data = ['foo=bar', 'foo?bar&baz'];
        assert.equal(
            queryParameters({ [data[0]]: data[1] }),
            data.map(encodeURIComponent).join('=')
        );
    });
});

describe('flattenObject', () => {
    it('should return null with null', () => {
        assert.strictEqual(flattenObject(null), null);
    });

    it('should return itself with a string', () => {
        assert.equal(flattenObject('foo'), 'foo');
    });

    it('should return itself with an array', () => {
        assert.deepEqual(flattenObject(['foo']), ['foo']);
    });

    it('should return a same object with an empty object', () => {
        assert.deepEqual(flattenObject({}), {});
    });

    it('should return a same object with a non-nested object', () => {
        const value = { foo: 'fooval', bar: 'barval' };
        assert.deepEqual(flattenObject(value), value);
    });

    it('should return a same object with a nested object', () => {
        const input = { foo: 'foo', bar: { baz: 'barbaz' } };
        const expected = { foo: 'foo', 'bar.baz': 'barbaz' };
        assert.deepEqual(flattenObject(input), expected);
    });
});

describe('createHeadersFromOptions', () => {
    it('should add a Content-Type header for POST requests', () => {
        const options = {
            method: 'POST',
        };

        const headers = createHeadersFromOptions(options);
        assert.strictEqual(headers.get('Content-Type'), 'application/json');
    });

    it('should not add a Content-Type header for GET requests', () => {
        const optionsWithoutMethod = {};
        const optionsWithMethod = {
            method: 'GET',
        };

        const headersWithMethod = createHeadersFromOptions(optionsWithMethod);
        assert.strictEqual(headersWithMethod.get('Content-Type'), null);

        const headersWithoutMethod = createHeadersFromOptions(
            optionsWithoutMethod
        );
        assert.strictEqual(headersWithoutMethod.get('Content-Type'), null);
    });
});
