import expect from 'expect';
import {
    createHeadersFromOptions,
    queryParameters,
    flattenObject,
} from './fetch';

describe('queryParameters', () => {
    it('should generate a query parameter', () => {
        const data = { foo: 'bar' };
        expect(queryParameters(data)).toEqual('foo=bar');
    });

    it('should generate multiple query parameters', () => {
        const data = { foo: 'fooval', bar: 'barval' };
        const actual = queryParameters(data);
        expect(['foo=fooval&bar=barval', 'bar=barval&foo=fooval']).toContain(
            actual
        );
    });

    it('should generate multiple query parameters with a same name', () => {
        const data = { foo: ['bar', 'baz'] };
        expect(queryParameters(data)).toEqual('foo=bar&foo=baz');
    });

    it('should generate an encoded query parameter', () => {
        const data = ['foo=bar', 'foo?bar&baz'];
        expect(queryParameters({ [data[0]]: data[1] })).toEqual(
            data.map(encodeURIComponent).join('=')
        );
    });
});

describe('flattenObject', () => {
    it('should return null with null', () => {
        expect(flattenObject(null)).toBeNull();
    });

    it('should return itself with a string', () => {
        expect(flattenObject('foo')).toEqual('foo');
    });

    it('should return itself with an array', () => {
        expect(flattenObject(['foo'])).toEqual(['foo']);
    });

    it('should return a same object with an empty object', () => {
        expect(flattenObject({})).toEqual({});
    });

    it('should return a same object with a non-nested object', () => {
        const value = { foo: 'fooval', bar: 'barval' };
        expect(flattenObject(value)).toEqual(value);
    });

    it('should return a same object with a nested object', () => {
        const input = { foo: 'foo', bar: { baz: 'barbaz' } };
        const expected = { foo: 'foo', 'bar.baz': 'barbaz' };
        expect(flattenObject(input)).toEqual(expected);
    });
});

describe('createHeadersFromOptions', () => {
    it('should add a Content-Type header for POST requests if there is a body', () => {
        const optionsWithBody = {
            method: 'POST',
            body: JSON.stringify(null),
        };

        const headers = createHeadersFromOptions(optionsWithBody);
        expect(headers.get('Content-Type')).toStrictEqual('application/json');
    });

    it('should not add a Content-Type header for POST requests with no body', () => {
        const optionsWithoutBody = {
            method: 'POST',
        };

        const headersWithoutBody = createHeadersFromOptions(optionsWithoutBody);
        expect(headersWithoutBody.get('Content-Type')).toBeNull();
    });

    it('should not add a Content-Type header for GET requests', () => {
        const optionsWithoutMethod = {};
        const optionsWithMethod = {
            method: 'GET',
        };

        const headersWithMethod = createHeadersFromOptions(optionsWithMethod);
        expect(headersWithMethod.get('Content-Type')).toBeNull();

        const headersWithoutMethod =
            createHeadersFromOptions(optionsWithoutMethod);
        expect(headersWithoutMethod.get('Content-Type')).toBeNull();
    });

    it('should not add a Content-Type header for DELETE requests with no body', () => {
        const optionsWithDelete = {
            method: 'DELETE',
        };

        const headersWithDelete = createHeadersFromOptions(optionsWithDelete);
        expect(headersWithDelete.get('Content-Type')).toBeNull();
        const optionsWithDeleteAndBody = {
            method: 'DELETE',
            body: JSON.stringify(null),
        };

        const headersWithDeleteAndBody = createHeadersFromOptions(
            optionsWithDeleteAndBody
        );
        expect(headersWithDeleteAndBody.get('Content-Type')).toStrictEqual(
            'application/json'
        );
    });

    it('should not add a Content-Type header if there already is a Content-Type header', () => {
        const optionsWithContentType = {
            headers: new Headers({
                'Content-Type': 'not undefined',
            }) as Headers,
            method: 'POST',
            body: 'not undefined either',
        };

        const headersWithContentType = createHeadersFromOptions(
            optionsWithContentType
        );
        expect(headersWithContentType.get('Content-Type')).toStrictEqual(
            'not undefined'
        );
    });
});
