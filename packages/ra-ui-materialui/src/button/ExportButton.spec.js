import { getRelatedIds } from './ExportButton';

describe('ExportButton', () => {
    describe('getRelatedIds', () => {
        it('should ignore null or undefined values', () => {
            const books = [
                { id: 1, author_id: 123, title: 'Pride and Prejudice' },
                { id: 2, author_id: null },
                { id: 3 },
            ];
            expect(getRelatedIds(books, 'author_id')).toEqual([123]);
        });
        it('should aggregate scalar related ids', () => {
            const books = [
                { id: 1, author_id: 123, title: 'Pride and Prejudice' },
                { id: 2, author_id: 123, title: 'Sense and Sensibility' },
                { id: 3, author_id: 456, title: 'War and Peace' },
            ];
            expect(getRelatedIds(books, 'author_id')).toEqual([123, 456]);
        });
        it('should aggregate arrays of related ids', () => {
            const books = [
                { id: 1, tag_ids: [1, 2], title: 'Pride and Prejudice' },
                { id: 2, tag_ids: [2, 3], title: 'Sense and Sensibility' },
                { id: 3, tag_ids: [4], title: 'War and Peace' },
            ];
            expect(getRelatedIds(books, 'tag_ids')).toEqual([1, 2, 3, 4]);
        });
    });
});
