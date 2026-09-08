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
        // Measuring the actual response time is unreliable on loaded CI
        // machines, so we check the duration passed to setTimeout instead.
        beforeEach(() => {
            jest.useFakeTimers();
        });
        afterEach(() => {
            jest.restoreAllMocks();
            jest.useRealTimers();
        });

        it.each([
            { label: 'undefined', delay: undefined, min: 0, max: 0 },
            { label: 'false', delay: false, min: 0, max: 0 },
            { label: 'number', delay: 100, min: 100, max: 100 },
            { label: 'true', delay: true, min: 500, max: 1500 },
            {
                label: 'object',
                delay: { min: 100, max: 200 },
                min: 100,
                max: 200,
            },
            { label: 'min 0', delay: { min: 0, max: 100 }, min: 0, max: 100 },
            { label: 'min only', delay: { min: 100 }, min: 100, max: 100 },
            { label: 'max only', delay: { max: 100 }, min: 0, max: 100 },
            { label: 'empty object', delay: {}, min: 0, max: 0 },
        ])(
            'should delay the response correctly when delay is $label',
            async ({ delay, min, max }) => {
                const setTimeoutSpy = jest.spyOn(global, 'setTimeout');
                const dataProvider = fakerestDataProvider(
                    { posts: [{ id: 0, title: 'Hello, world!' }] },
                    false,
                    delay
                );

                const promise = dataProvider.getOne('posts', { id: 0 });
                jest.runAllTimers();
                const { data } = await promise;

                expect(data).toEqual({ id: 0, title: 'Hello, world!' });
                if (max === 0) {
                    // No delay: the response is returned right away
                    expect(setTimeoutSpy).not.toHaveBeenCalled();
                } else {
                    expect(setTimeoutSpy).toHaveBeenCalledTimes(1);
                    const scheduledDelay = setTimeoutSpy.mock.calls[0][1];
                    expect(scheduledDelay).toBeGreaterThanOrEqual(min);
                    expect(scheduledDelay).toBeLessThanOrEqual(max);
                }
            }
        );
    });
});
