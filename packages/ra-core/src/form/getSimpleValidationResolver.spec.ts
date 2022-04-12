import {
    getSimpleValidationResolver,
    flattenKeys,
} from './getSimpleValidationResolver';

describe('getSimpleValidationResolver', () => {
    const validator = getSimpleValidationResolver(values => values);

    it('should return a flattened object', async () => {
        const result = flattenKeys({
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
                'backlinks.0.url': {
                    type: 'manual',
                    message: 'url too short',
                },
                'backlinks.0.id': {
                    type: 'manual',
                    message: 'missing id',
                },
                'backlinks.1.url': {
                    type: 'manual',
                    message: 'url too short',
                },
                'backlinks.1.id': {
                    type: 'manual',
                    message: 'missing id',
                },
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

    it('should use nested values keys', async () => {
        const result = await validator({
            title: 'title too short',
            'backlinks.0.url': 'url too short',
        });

        expect(result).toEqual({
            values: {},
            errors: {
                title: { type: 'manual', message: 'title too short' },
                'backlinks.0.url': {
                    type: 'manual',
                    message: 'url too short',
                },
            },
        });
    });
});
