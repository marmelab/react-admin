import expect from 'expect';

import fakerestDataProvider from './index';

describe('ra-data-fakerest', () => {
    describe('getMany', () => {
        it('should return the records matching the given ids', async () => {
            const dataProvider = fakerestDataProvider({
                posts: [
                    { id: 0, title: 'Hello, world!' },
                    { id: 1, title: 'FooBar' },
                    { id: 2, title: 'Goodbye, world!' },
                ],
            });
            const { data } = await dataProvider.getMany('posts', {
                ids: [1, 2],
            });
            expect(data).toEqual([
                { id: 1, title: 'FooBar' },
                { id: 2, title: 'Goodbye, world!' },
            ]);
        });
        it('should preserve the order of the ids', async () => {
            const dataProvider = fakerestDataProvider({
                posts: [
                    { id: 0, title: 'Hello, world!' },
                    { id: 1, title: 'FooBar' },
                    { id: 2, title: 'Goodbye, world!' },
                ],
            });
            const { data } = await dataProvider.getMany('posts', {
                ids: [2, 0],
            });
            expect(data).toEqual([
                { id: 2, title: 'Goodbye, world!' },
                { id: 0, title: 'Hello, world!' },
            ]);
        });
        it('should return an empty result when no ids are provided', async () => {
            const dataProvider = fakerestDataProvider({
                posts: [
                    { id: 0, title: 'Hello, world!' },
                    { id: 1, title: 'FooBar' },
                    { id: 2, title: 'Goodbye, world!' },
                ],
            });
            const { data } = await dataProvider.getMany('posts', {
                ids: [],
            });
            expect(data).toEqual([]);
        });
        it('should return an error when requesting a nonexisting id', async () => {
            jest.spyOn(console, 'error').mockImplementationOnce(() => {});
            const dataProvider = fakerestDataProvider({
                posts: [
                    { id: 0, title: 'Hello, world!' },
                    { id: 1, title: 'FooBar' },
                    { id: 2, title: 'Goodbye, world!' },
                ],
            });
            expect(async () => {
                await dataProvider.getMany('posts', { ids: [0, 3] });
            }).rejects.toThrow();
        });
    });

    describe('delay', () => {
        it.each([
            { label: 'undefined', delay: undefined, min: 0, max: 20 },
            { label: 'false', delay: false, min: 0, max: 20 },
            { label: 'number', delay: 100, min: 100, max: 150 },
            { label: 'true', delay: true, min: 500, max: 1550 },
            {
                label: 'object',
                delay: { min: 100, max: 200 },
                min: 100,
                max: 250,
            },
            { label: 'min 0', delay: { min: 0, max: 100 }, min: 0, max: 150 },
            { label: 'min only', delay: { min: 100 }, min: 100, max: 150 },
            { label: 'max only', delay: { max: 100 }, min: 0, max: 150 },
            { label: 'empty object', delay: {}, min: 0, max: 20 },
        ])(
            'should delay the response correctly when delay is $label',
            async ({ delay, min, max }) => {
                const dataProvider = fakerestDataProvider(
                    { posts: [{ id: 0, title: 'Hello, world!' }] },
                    false,
                    delay
                );
                const start = Date.now();
                await dataProvider.getOne('posts', { id: 0 });
                const end = Date.now();
                const duration = end - start;

                expect(duration).toBeGreaterThanOrEqual(min);
                if (max > 20) {
                    // Only check max for non-immediate responses to avoid flakiness
                    expect(duration).toBeLessThanOrEqual(max);
                }
            }
        );
    });
});
