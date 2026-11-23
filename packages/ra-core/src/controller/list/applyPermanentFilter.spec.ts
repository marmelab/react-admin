import expect from 'expect';
import { applyPermanentFilter } from './applyPermanentFilter';

describe('applyPermanentFilter', () => {
    it('should merge the filter values with the permanent filter', () => {
        expect(applyPermanentFilter({ q: 'foo' }, { published: true })).toEqual(
            { q: 'foo', published: true }
        );
    });

    it('should accept empty filters', () => {
        expect(applyPermanentFilter(undefined, undefined)).toEqual({});
        expect(applyPermanentFilter(null, { published: true })).toEqual({
            published: true,
        });
        expect(applyPermanentFilter({ q: 'foo' }, null)).toEqual({ q: 'foo' });
    });

    it('should override the filter values with the permanent filter', () => {
        expect(
            applyPermanentFilter({ published: false }, { published: true })
        ).toEqual({ published: true });
    });

    it('should put the permanent filter keys after the filter values', () => {
        expect(
            Object.entries(
                applyPermanentFilter(
                    { 'author.id': 0, author: { id: 2 } },
                    { 'author.id': 1 }
                )
            )
        ).toEqual([
            ['author', { id: 2 }],
            ['author.id', 1],
        ]);
        expect(
            Object.entries(
                applyPermanentFilter(
                    { author: 0, 'author.id': 2 },
                    { author: { id: 1 } }
                )
            )
        ).toEqual([
            ['author.id', 2],
            ['author', { id: 1 }],
        ]);
    });

    it.each([
        'published[]',
        'published[0]',
        '[published]',
        'published[]x',
        'published[0]x',
        '[published]x',
        'published[] ',
        'published[][]',
    ])(
        'should ignore the filter value %s when the permanent filter sets the field',
        key => {
            expect(
                applyPermanentFilter(
                    { q: 'foo', [key]: false },
                    { published: true }
                )
            ).toEqual({ q: 'foo', published: true });
        }
    );

    it('should ignore the bracket notations of nested fields', () => {
        expect(
            applyPermanentFilter(
                { author: { 'id[]': 2, name: 'John' } },
                { 'author.id': 1 }
            )
        ).toEqual({ author: { name: 'John' }, 'author.id': 1 });
        expect(
            applyPermanentFilter({ 'author.id[]': 2 }, { author: { id: 1 } })
        ).toEqual({ author: { id: 1 } });
        expect(
            applyPermanentFilter(
                { author: { 'id[]x': 2 }, 'author[id]': 3 },
                { 'author.id': 1 }
            )
        ).toEqual({ author: {}, 'author.id': 1 });
    });

    it('should keep the filter values using brackets for other fields', () => {
        expect(
            applyPermanentFilter(
                { 'tags[]': 'foo', 'price[gte]': 10, 'price]x[]': 5 },
                { 'price[lte]': 100 }
            )
        ).toEqual({
            'tags[]': 'foo',
            'price[gte]': 10,
            'price]x[]': 5,
            'price[lte]': 100,
        });
    });
});
