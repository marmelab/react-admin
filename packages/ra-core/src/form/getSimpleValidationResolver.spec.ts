import {
    getSimpleValidationResolver,
    flattenErrors,
} from './getSimpleValidationResolver';

describe('getSimpleValidationResolver', () => {
    describe('flattenErrors', () => {
        it('should return a flattened object', async () => {
            const result = flattenErrors({
                title: 'title too short',
                backlinks: [
                    { url: 'url too short', id: 'missing id' },
                    { url: 'url too short', id: 'missing id' },
                ],
            });
            expect(result).toEqual({
                title: 'title too short',
                'backlinks.0.url': 'url too short',
                'backlinks.0.id': 'missing id',
                'backlinks.1.url': 'url too short',
                'backlinks.1.id': 'missing id',
            });
        });

        it('should support complex translation messages', async () => {
            const result = flattenErrors({
                title: 'title too short',
                body: {
                    message: 'Not good for %{variable}',
                    args: {
                        variable: 'you',
                    },
                },
                backlinks: [
                    { url: 'url too short', id: 'missing id' },
                    { url: 'url too short', id: 'missing id' },
                ],
            });
            expect(result).toEqual({
                title: 'title too short',
                body: {
                    message: 'Not good for %{variable}',
                    args: {
                        variable: 'you',
                    },
                },
                'backlinks.0.url': 'url too short',
                'backlinks.0.id': 'missing id',
                'backlinks.1.url': 'url too short',
                'backlinks.1.id': 'missing id',
            });
        });
    });

    describe('validator', () => {
        const validator = getSimpleValidationResolver(values => values);

        it('should resolve array values as nested keys', async () => {
            const result = await validator({
                title: 'title too short',
                backlinks: [
                    { url: 'url too short', id: 'missing id' },
                    { url: 'url too short', id: 'missing id' },
                ],
            });

            expect(result).toEqual({
                values: {},
                errors: {
                    title: { type: 'manual', message: 'title too short' },
                    backlinks: [
                        {
                            url: {
                                type: 'manual',
                                message: 'url too short',
                            },
                            id: {
                                type: 'manual',
                                message: 'missing id',
                            },
                        },
                        {
                            url: {
                                type: 'manual',
                                message: 'url too short',
                            },
                            id: {
                                type: 'manual',
                                message: 'missing id',
                            },
                        },
                    ],
                },
            });
        });

        it('should treat an empty array value as no error', async () => {
            const result = await validator({
                title: 'title too short',
                backlinks: [],
            });

            expect(result).toEqual({
                values: {},
                errors: {
                    title: { type: 'manual', message: 'title too short' },
                },
            });
        });

        it('should treat an array with empty objects as no error', async () => {
            const result = await validator({
                title: 'title too short',
                backlinks: [{}, {}],
            });

            expect(result).toEqual({
                values: {},
                errors: {
                    title: { type: 'manual', message: 'title too short' },
                },
            });
        });

        it('should treat an empty object value as no error', async () => {
            const result = await validator({
                title: 'title too short',
                backlinks: {},
            });

            expect(result).toEqual({
                values: {},
                errors: {
                    title: { type: 'manual', message: 'title too short' },
                },
            });
        });

        it('should resolve nested error objects', async () => {
            const result = await validator({
                title: 'title too short',
                comment: {
                    author: 'author is required',
                },
            });

            expect(result).toEqual({
                values: {},
                errors: {
                    title: { type: 'manual', message: 'title too short' },
                    comment: {
                        author: {
                            type: 'manual',
                            message: 'author is required',
                        },
                    },
                },
            });
        });
    });
});
