import { getSimpleValidationResolver } from './getSimpleValidationResolver';

describe('getSimpleValidationResolver', () => {
    const validator = getSimpleValidationResolver(errors => errors);

    it('should receive a flattened errors object', async () => {
        const errors = await validator({
            title: 'title too short',
            backlinks: [
                { url: 'url too short', id: 'missing id' },
                { url: 'url too short', id: 'missing id' },
            ],
        });

        expect(errors).toEqual({
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

    it('should treat an empty array as no error', async () => {
        const errors = await validator({
            title: 'title too short',
            backlinks: [],
        });

        expect(errors).toEqual({
            values: {},
            errors: {
                title: { type: 'manual', message: 'title too short' },
            },
        });
    });

    it('should treat an empty object as no error', async () => {
        const errors = await validator({
            title: 'title too short',
            backlinks: {},
        });

        expect(errors).toEqual({
            values: {},
            errors: {
                title: { type: 'manual', message: 'title too short' },
            },
        });
    });

    it('should use nested error keys', async () => {
        const errors = await validator({
            title: 'title too short',
            'backlinks.0.url': 'url too short',
        });

        expect(errors).toEqual({
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
