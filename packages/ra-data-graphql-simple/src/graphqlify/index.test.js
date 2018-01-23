import graphqlify, { encodeQuery, encodeMutation } from './';

describe('graphqlify', function() {
    it('should encode a simple field', function() {
        const out = graphqlify({ a: 1 });
        expect(out).toEqual('query {a}');
    });

    it('should encode multiple fields', function() {
        const out = graphqlify({ a: 1, b: true, c: {}, d: null });
        expect(out).toEqual('query {a,b,c}');
    });

    it('should encode field with a label', function() {
        const out = graphqlify({ a: { field: 'b' } });
        expect(out).toEqual('query {a:b}');
    });

    it('should encode a field with nested fields', function() {
        const out = graphqlify({ a: { fields: { b: { fields: { c: 1 } } } } });
        expect(out).toEqual('query {a{b{c}}}');
    });

    it('should encode field with parameter', function() {
        const out = graphqlify({ a: { params: { b: 'c' } } });
        expect(out).toEqual('query {a(b:c)}');
    });

    it('should encode a field with params and nested fields', function() {
        const out = graphqlify({ a: { params: { b: 'c' }, fields: { d: 1 } } });
        expect(out).toEqual('query {a(b:c){d}}');
    });
});

describe('encodeQuery', function() {
    it('should encode a graphql query', function() {
        const out = encodeQuery({ a: 1 });
        expect(out).toEqual('query {a}');
    });

    it('should encode a named graphql query', function() {
        const out = encodeQuery('q1', { a: 1 });
        expect(out).toEqual('query q1{a}');
    });
});

describe('encodeMutation', function() {
    it('should encode a graphql mutation', function() {
        const out = encodeMutation({ a: 1 });
        expect(out).toEqual('mutation {a}');
    });

    it('should encode a named graphql mutation', function() {
        const out = encodeMutation('m1', { a: 1 });
        expect(out).toEqual('mutation m1{a}');
    });
});
