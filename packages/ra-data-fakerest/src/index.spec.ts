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
});
