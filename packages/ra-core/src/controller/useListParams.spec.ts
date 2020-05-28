import { getQuery } from './useListParams';
import {
    SORT_DESC,
    SORT_ASC,
} from '../reducer/admin/resource/list/queryReducer';

describe('useListParams', () => {
    describe('getQuery', () => {
        it('Returns the values from the location first', () => {
            const query = getQuery({
                queryFromLocation: {
                    page: 3,
                    perPage: 15,
                    sort: 'name',
                    order: SORT_ASC,
                    filter: { name: 'marmelab' },
                },
                params: {
                    page: 1,
                    perPage: 10,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 3,
                perPage: 15,
                sort: 'name',
                order: SORT_ASC,
                filter: {
                    name: 'marmelab',
                },
            });
        });
        it('Extends the values from the location with those from the props', () => {
            const query = getQuery({
                queryFromLocation: {
                    filter: { name: 'marmelab' },
                },
                params: {
                    page: 1,
                    perPage: 10,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 1,
                perPage: 50,
                sort: 'company',
                order: SORT_DESC,
                filter: {
                    name: 'marmelab',
                },
            });
        });
        it('Sets the values from the redux store if location does not have them', () => {
            const query = getQuery({
                queryFromLocation: {},
                params: {
                    page: 2,
                    perPage: 10,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 2,
                perPage: 10,
                sort: 'city',
                order: SORT_DESC,
                filter: {
                    city: 'Dijon',
                },
            });
        });
        it('Extends the values from the redux store with those from the props', () => {
            const query = getQuery({
                queryFromLocation: {},
                params: {
                    page: 2,
                    sort: 'city',
                    order: SORT_DESC,
                    filter: {
                        city: 'Dijon',
                    },
                },
                filterDefaultValues: {},
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 2,
                perPage: 50,
                sort: 'city',
                order: SORT_DESC,
                filter: {
                    city: 'Dijon',
                },
            });
        });
        it('Uses the filterDefaultValues if neither the location or the redux store have them', () => {
            const query = getQuery({
                queryFromLocation: {},
                params: {},
                filterDefaultValues: { city: 'Nancy' },
                perPage: 50,
                sort: {
                    field: 'company',
                    order: SORT_DESC,
                },
            });

            expect(query).toEqual({
                page: 1,
                perPage: 50,
                sort: 'company',
                order: SORT_DESC,
                filter: {
                    city: 'Nancy',
                },
            });
        });
    });
});
