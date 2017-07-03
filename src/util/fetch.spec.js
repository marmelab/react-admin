import assert from 'assert';
import { queryParameters } from './fetch';

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
