import simpleClient from '.';

describe('Data Simple REST Client', () => {
    describe('getList', () => {
        it('should include the `Range` header in request (for Chrome compatibility purpose)', async () => {
            const httpClient = jest.fn(() =>
                Promise.resolve({
                    headers: new Headers({
                        'content-range': '0/4-8',
                    }),
                })
            );
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.getList('posts', {
                filter: {},
                pagination: {
                    page: 1,
                    perPage: 10,
                },
                sort: {
                    field: 'title',
                    order: 'DESC',
                },
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts?filter=%7B%7D&range=%5B0%2C9%5D&sort=%5B%22title%22%2C%22DESC%22%5D',
                {
                    headers: {
                        map: {
                            range: 'posts=0-9',
                        },
                    },
                }
            );
        });

        it('should use a custom http header to retrieve the number of items in the collection', async () => {
            const httpClient = jest.fn(() =>
                Promise.resolve({
                    headers: new Headers({
                        'x-total-count': '42',
                    }),
                    json: [{ id: 1 }],
                    status: 200,
                    body: '',
                })
            );
            const client = simpleClient(
                'http://localhost:3000',
                httpClient,
                'X-Total-Count'
            );

            const result = await client.getList('posts', {
                filter: {},
                pagination: {
                    page: 1,
                    perPage: 10,
                },
                sort: {
                    field: 'title',
                    order: 'DESC',
                },
            });

            expect(result.total).toEqual(42);
        });
        it('should support embeds via meta', async () => {
            const httpClient = jest.fn(() =>
                Promise.resolve({
                    headers: new Headers({
                        'content-range': '0/4-8',
                    }),
                })
            );
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.getList('posts', {
                filter: {},
                pagination: { page: 1, perPage: 10 },
                sort: { field: 'title', order: 'DESC' },
                meta: { embed: ['author'] },
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts?embed=%5B%22author%22%5D&filter=%7B%7D&range=%5B0%2C9%5D&sort=%5B%22title%22%2C%22DESC%22%5D',
                { headers: { map: { range: 'posts=0-9' } } }
            );
        });
    });
    describe('getOne', () => {
        it('should allow numeric id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ id: 123 });
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.getOne('posts', { id: 123 });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/123',
                expect.any(Object)
            );
        });
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ id: 'Post#123' });
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.getOne('posts', { id: 'Post#123' });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
        it('should support embeds via meta', async () => {
            const httpClient = jest.fn().mockResolvedValue({ id: 'Post#123' });
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.getOne('posts', {
                id: 'Post#123',
                meta: { embed: ['author'] },
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123?embed=%5B%22author%22%5D',
                expect.any(Object)
            );
        });
    });
    describe('update', () => {
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ id: 'Post#123' });
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.update('posts', {
                previousData: undefined,
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
            const httpClient = jest
                .fn()
                .mockResolvedValue({ json: ['Post#123'] });
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.updateMany('posts', {
                data: { body: '' },
                ids: ['Post#123'],
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
    describe('delete', () => {
        it('should set the `Content-Type` header to `text/plain`', async () => {
            const httpClient = jest.fn().mockResolvedValue({ json: { id: 1 } });

            const client = simpleClient('http://localhost:3000', httpClient);

            await client.delete('posts', {
                id: 1,
                previousData: { id: 1 },
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/1',
                {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                }
            );
        });
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ id: 'Post#123' });
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.delete('posts', {
                previousData: undefined,
                id: 'Post#123',
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
    describe('deleteMany', () => {
        it('should set the `Content-Type` header to `text/plain`', async () => {
            const httpClient = jest.fn().mockResolvedValue({ json: [1] });

            const client = simpleClient('http://localhost:3000', httpClient);

            await client.deleteMany('posts', {
                ids: [1, 2],
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/1',
                {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                }
            );

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/2',
                {
                    method: 'DELETE',
                    headers: new Headers({
                        'Content-Type': 'text/plain',
                    }),
                }
            );
        });
        it('should escape id in path', async () => {
            const httpClient = jest
                .fn()
                .mockResolvedValue({ json: ['Post#123'] });
            const client = simpleClient('http://localhost:3000', httpClient);

            await client.deleteMany('posts', {
                ids: ['Post#123'],
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts/Post%23123',
                expect.any(Object)
            );
        });
    });
});
