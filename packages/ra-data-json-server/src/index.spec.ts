import jsonServerProvider from './index';

describe('Data JSON Server Client', () => {
    const setup = () => {
        const httpClient = jest
            .fn()
            .mockResolvedValue({ json: { id: 'Post#123' } });
        const client = jsonServerProvider('http://localhost:3000', httpClient);
        return { httpClient, client };
    };

    describe('getOne', () => {
        it('should allow numeric id in path', async () => {
            const { httpClient, client } = setup();

            await client.getOne('posts', { id: 123 });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/123',
                expect.any(Object)
            );
        });
        it('should escape id in path', async () => {
            const { httpClient, client } = setup();

            await client.getOne('posts', { id: 'Post#123' });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
    describe('update', () => {
        it('should escape id in path', async () => {
            const { httpClient, client } = setup();

            await client.update('posts', {
                previousData: { id: 'Post#123' },
                id: 'Post#123',
                data: { body: '' },
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
    describe('updateMany', () => {
        it('should escape id in path', async () => {
            const { httpClient, client } = setup();

            await client.updateMany('posts', {
                ids: ['Post#123'],
                data: { body: '' },
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
    describe('delete', () => {
        it('should escape id in path', async () => {
            const { httpClient, client } = setup();

            await client.delete('posts', {
                previousData: { id: 'Post#123' },
                id: 'Post#123',
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
    describe('deleteMany', () => {
        it('should escape id in path', async () => {
            const { httpClient, client } = setup();

            await client.deleteMany('posts', { ids: ['Post#123'] });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
});
