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
});
