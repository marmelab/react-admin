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
                    order: 'desc',
                },
            });

            expect(httpClient).toHaveBeenCalledWith(
                'http://localhost:3000/posts?filter=%7B%7D&range=%5B0%2C9%5D&sort=%5B%22title%22%2C%22desc%22%5D',
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
                    order: 'desc',
                },
            });

            expect(result.total).toEqual(42);
        });
    });
});
