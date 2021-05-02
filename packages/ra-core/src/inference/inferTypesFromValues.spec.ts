import expect from 'expect';
import { inferTypeFromValues } from './inferTypeFromValues';

describe('inferTypeFromValues', () => {
    it('should return an InferredElement', () => {
        expect(inferTypeFromValues('id', ['foo'])).toEqual({
            type: 'id',
            props: { source: 'id' },
        });
    });
    it('should return an id field for field named id', () => {
        expect(inferTypeFromValues('id', ['foo', 'bar'])).toEqual({
            type: 'id',
            props: { source: 'id' },
        });
    });
    it('should return a reference field for field named *_id', () => {
        expect(inferTypeFromValues('foo_id', ['foo', 'bar'])).toEqual({
            type: 'reference',
            props: { source: 'foo_id', reference: 'foos' },
            children: { type: 'referenceChild' },
        });
    });
    it('should return a reference field for field named *Id', () => {
        expect(inferTypeFromValues('fooId', ['foo', 'bar'])).toEqual({
            type: 'reference',
            props: { source: 'fooId', reference: 'foos' },
            children: { type: 'referenceChild' },
        });
    });
    it('should return a reference array field for field named *_ids', () => {
        expect(inferTypeFromValues('foo_ids', ['foo', 'bar'])).toEqual({
            type: 'referenceArray',
            props: { source: 'foo_ids', reference: 'foos' },
            children: { type: 'referenceArrayChild' },
        });
    });
    it('should return a reference array field for field named *Ids', () => {
        expect(inferTypeFromValues('fooIds', ['foo', 'bar'])).toEqual({
            type: 'referenceArray',
            props: { source: 'fooIds', reference: 'foos' },
            children: { type: 'referenceArrayChild' },
        });
    });
    it('should return a string field for no values', () => {
        expect(inferTypeFromValues('foo', [])).toEqual({
            type: 'string',
            props: { source: 'foo' },
        });
    });
    it('should return an array field for array of object values', () => {
        expect(
            inferTypeFromValues('foo', [
                [{ bar: 1 }, { bar: 2 }],
                [{ bar: 3 }, { bar: 4 }],
            ])
        ).toEqual({
            type: 'array',
            props: { source: 'foo' },
            children: [{ type: 'number', props: { source: 'bar' } }],
        });
    });
    it('should return a string field for array of non-object values', () => {
        expect(
            inferTypeFromValues('foo', [
                [1, 2],
                [3, 4],
            ])
        ).toEqual({
            type: 'string',
            props: { source: 'foo' },
        });
    });
    it('should return a boolean field for boolean values', () => {
        expect(inferTypeFromValues('foo', [true, false, true])).toEqual({
            type: 'boolean',
            props: { source: 'foo' },
        });
    });
    it('should return a date field for date values', () => {
        expect(
            inferTypeFromValues('foo', [
                new Date('2018-10-01'),
                new Date('2018-12-03'),
            ])
        ).toEqual({
            type: 'date',
            props: { source: 'foo' },
        });
    });
    it('should return an email field for email name', () => {
        expect(inferTypeFromValues('email', ['whatever'])).toEqual({
            type: 'email',
            props: { source: 'email' },
        });
    });
    it('should return an email field for email string values', () => {
        expect(
            inferTypeFromValues('foo', ['me@example.com', 'you@foo.co.uk'])
        ).toEqual({
            type: 'email',
            props: { source: 'foo' },
        });
    });
    it('should return a url field for url name', () => {
        expect(inferTypeFromValues('url', ['whatever', 'whatever'])).toEqual({
            type: 'url',
            props: { source: 'url' },
        });
    });
    it('should return a url field for url string values', () => {
        expect(
            inferTypeFromValues('foo', [
                'http://foo.com/bar',
                'https://www.foo.com/index.html#foo',
            ])
        ).toEqual({
            type: 'url',
            props: { source: 'foo' },
        });
    });
    it('should return a date field for date string values', () => {
        expect(
            inferTypeFromValues('foo', ['2018-10-01', '2018-12-03'])
        ).toEqual({
            type: 'date',
            props: { source: 'foo' },
        });
    });
    it('should return a rich text field for HTML values', () => {
        expect(
            inferTypeFromValues('foo', [
                'This is <h1>Good</h1>',
                '<body><h1>hello</h1>World</body>',
            ])
        ).toEqual({
            type: 'richText',
            props: { source: 'foo' },
        });
    });
    it('should return a string field for string values', () => {
        expect(
            inferTypeFromValues('foo', ['This is Good', 'hello, World!'])
        ).toEqual({
            type: 'string',
            props: { source: 'foo' },
        });
    });
    it('should return a number field for number values', () => {
        expect(inferTypeFromValues('foo', [12, 1e23, 653.56])).toEqual({
            type: 'number',
            props: { source: 'foo' },
        });
    });
    it('should return a typed field for object values', () => {
        expect(
            inferTypeFromValues('foo', [
                { bar: 1, baz: 2 },
                { bar: 3, baz: 4 },
            ])
        ).toEqual({
            type: 'number',
            props: { source: 'foo.bar' },
        });
    });
});
