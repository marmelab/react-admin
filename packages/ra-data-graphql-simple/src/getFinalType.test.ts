import { TypeKind } from 'graphql';
import getFinalType from './getFinalType';

describe('getFinalType', () => {
    it('returns the correct type for SCALAR types', () => {
        expect(getFinalType({ name: 'foo', kind: TypeKind.SCALAR })).toEqual({
            name: 'foo',
            kind: TypeKind.SCALAR,
        });
    });
    it('returns the correct type for NON_NULL types', () => {
        expect(
            getFinalType({
                kind: TypeKind.NON_NULL,
                ofType: { name: 'foo', kind: TypeKind.SCALAR },
            })
        ).toEqual({
            name: 'foo',
            kind: TypeKind.SCALAR,
        });
    });
    it('returns the correct type for LIST types', () => {
        expect(
            getFinalType({
                kind: TypeKind.LIST,
                ofType: { name: 'foo', kind: TypeKind.SCALAR },
            })
        ).toEqual({
            name: 'foo',
            kind: TypeKind.SCALAR,
        });
    });
    it('returns the correct type for NON_NULL LIST types', () => {
        expect(
            getFinalType({
                kind: TypeKind.NON_NULL,
                ofType: {
                    kind: TypeKind.LIST,
                    ofType: { name: 'foo', kind: TypeKind.SCALAR },
                },
            })
        ).toEqual({ name: 'foo', kind: TypeKind.SCALAR });
    });
});
