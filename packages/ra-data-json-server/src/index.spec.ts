import jsonServerClient from '.';

describe('Data JSON Server Client', () => {
    const id = '../users/1?_embed=posts#';
    const escapedUrl =
        'http://localhost:3000/posts/..%2Fusers%2F1%3F_embed%3Dposts%23';

    describe('getOne', () => {
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ json: { id } });
            const client = jsonServerClient(
                'http://localhost:3000',
                httpClient
            );

            await client.getOne('posts', { id });

            expect(httpClient).toHaveBeenCalledWith(
                escapedUrl,
                expect.any(Object)
            );
        });
    });
    describe('update', () => {
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ json: { id } });
            const client = jsonServerClient(
                'http://localhost:3000',
                httpClient
            );

            await client.update('posts', {
                previousData: undefined,
                id,
                data: { body: '' },
            });

            expect(httpClient).toHaveBeenCalledWith(
                escapedUrl,
                expect.any(Object)
            );
        });
    });
    describe('updateMany', () => {
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ json: { id } });
            const client = jsonServerClient(
                'http://localhost:3000',
                httpClient
            );

            await client.updateMany('posts', {
                data: { body: '' },
                ids: [id],
            });

            expect(httpClient).toHaveBeenCalledWith(
                escapedUrl,
                expect.any(Object)
            );
        });
    });
    describe('delete', () => {
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ json: { id } });
            const client = jsonServerClient(
                'http://localhost:3000',
                httpClient
            );

            await client.delete('posts', {
                previousData: undefined,
                id,
            });

            expect(httpClient).toHaveBeenCalledWith(
                escapedUrl,
                expect.any(Object)
            );
        });
    });
    describe('deleteMany', () => {
        it('should escape id in path', async () => {
            const httpClient = jest.fn().mockResolvedValue({ json: { id } });
            const client = jsonServerClient(
                'http://localhost:3000',
                httpClient
            );

            await client.deleteMany('posts', {
                ids: [id],
            });

            expect(httpClient).toHaveBeenCalledWith(
                escapedUrl,
                expect.any(Object)
            );
        });
    });
    describe('invalid identifiers', () => {
        it.each(['.', '..', ''])(
            'should not send a request for the id "%s"',
            async id => {
                const httpClient = jest.fn().mockResolvedValue({ json: {} });
                const client = jsonServerClient(
                    'http://localhost:3000',
                    httpClient
                );
                const data = { body: '' };

                const error = 'cannot build a URL';

                await expect(client.getOne('posts', { id })).rejects.toThrow(
                    error
                );
                await expect(
                    client.update('posts', { id, data, previousData: { id } })
                ).rejects.toThrow(error);
                await expect(
                    client.updateMany('posts', { ids: [1, id], data })
                ).rejects.toThrow(error);
                await expect(client.delete('posts', { id })).rejects.toThrow(
                    error
                );
                await expect(
                    client.deleteMany('posts', { ids: [1, id] })
                ).rejects.toThrow(error);
                expect(httpClient).not.toHaveBeenCalled();
            }
        );
    });
});
