import expect from 'expect';

import removeUndefined from './removeUndefined';

describe('removeUndefined', () => {
    it('removes undefined values without changing Date instances', () => {
        const date = new Date('2024-01-01T00:00:00.000Z');

        const result = removeUndefined({
            id: undefined,
            title: 'Hello',
            publishedAt: date,
            metadata: {
                archivedAt: undefined,
                updatedAt: date,
            },
            tags: [undefined, { createdAt: date }],
        });

        expect(result).toEqual({
            title: 'Hello',
            publishedAt: date,
            metadata: {
                updatedAt: date,
            },
            tags: [undefined, { createdAt: date }],
        });
        expect(result.publishedAt).toBeInstanceOf(Date);
        expect(result.metadata.updatedAt).toBeInstanceOf(Date);
        expect(result.tags[1].createdAt).toBeInstanceOf(Date);
    });
});
