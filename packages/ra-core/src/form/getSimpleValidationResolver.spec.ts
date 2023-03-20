import { getSimpleValidationResolver } from './getSimpleValidationResolver';

describe('getSimpleValidationResolver', () => {
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
                title: {
                    type: 'manual',
                    message: { message: 'title too short' },
                },
                backlinks: [
                    {
                        url: {
                            type: 'manual',
                            message: { message: 'url too short' },
                        },
                        id: {
                            type: 'manual',
                            message: { message: 'missing id' },
                        },
                    },
                    {
                        url: {
                            type: 'manual',
                            message: { message: 'url too short' },
                        },
                        id: {
                            type: 'manual',
                            message: { message: 'missing id' },
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
                title: {
                    type: 'manual',
                    message: { message: 'title too short' },
                },
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
                title: {
                    type: 'manual',
                    message: { message: 'title too short' },
                },
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
                title: {
                    type: 'manual',
                    message: { message: 'title too short' },
                },
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
                title: {
                    type: 'manual',
                    message: { message: 'title too short' },
                },
                comment: {
                    author: {
                        type: 'manual',
                        message: { message: 'author is required' },
                    },
                },
            },
        });
    });

    it('should handle RA translation objects', async () => {
        const result = await validator({
            title: 'title too short',
            average_note: {
                message: 'ra.validation.minValue',
                args: { min: 2 },
            },
        });

        expect(result).toEqual({
            values: {},
            errors: {
                title: {
                    type: 'manual',
                    message: { message: 'title too short' },
                },
                average_note: {
                    type: 'manual',
                    message: {
                        message: 'ra.validation.minValue',
                        args: { min: 2 },
                    },
                },
            },
        });
    });

    it('should handle RA translation objects in arrays', async () => {
        const result = await validator({
            title: 'title too short',
            backlinks: [
                {
                    average_note: {
                        message: 'ra.validation.minValue',
                        args: { min: 2 },
                    },
                },
                { id: 'missing id' },
            ],
        });

        expect(result).toEqual({
            values: {},
            errors: {
                title: {
                    type: 'manual',
                    message: { message: 'title too short' },
                },
                backlinks: [
                    {
                        average_note: {
                            type: 'manual',
                            message: {
                                message: 'ra.validation.minValue',
                                args: { min: 2 },
                            },
                        },
                    },
                    {
                        id: {
                            type: 'manual',
                            message: { message: 'missing id' },
                        },
                    },
                ],
            },
        });
    });
});
