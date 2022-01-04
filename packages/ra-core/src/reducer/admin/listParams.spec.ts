import expect from 'expect';

import { listParams } from './listParams';
import { changeListParams } from '../../actions/listActions';

describe('listParams reducer', () => {
    describe('CRUD_CHANGE_LIST_PARAMS action', () => {
        it('should set the list params for that resource', () => {
            expect(
                listParams(
                    {
                        foo: {
                            sort: 'id',
                            order: 'DESC',
                            page: 1,
                            perPage: 10,
                            filter: {},
                            displayedFilters: [],
                        },
                    },
                    changeListParams('foo', {
                        sort: 'id',
                        order: 'ASC',
                        page: 1,
                        perPage: 10,
                        filter: {},
                        displayedFilters: [],
                    })
                )
            ).toEqual({
                foo: {
                    sort: 'id',
                    order: 'ASC',
                    page: 1,
                    perPage: 10,
                    filter: {},
                    displayedFilters: [],
                },
            });
        });

        it('should work on a resource without any prior activity', () => {
            expect(
                listParams(
                    {},
                    changeListParams('foo', {
                        sort: 'id',
                        order: 'ASC',
                        page: 1,
                        perPage: 10,
                        filter: {},
                        displayedFilters: [],
                    })
                )
            ).toEqual({
                foo: {
                    sort: 'id',
                    order: 'ASC',
                    page: 1,
                    perPage: 10,
                    filter: {},
                    displayedFilters: [],
                },
            });
        });
        it('should not affect other resources', () => {
            expect(
                listParams(
                    {
                        bar: {
                            sort: 'id',
                            order: 'DESC',
                            page: 1,
                            perPage: 10,
                            filter: {},
                            displayedFilters: [],
                        },
                    },
                    changeListParams('foo', {
                        sort: 'id',
                        order: 'ASC',
                        page: 1,
                        perPage: 10,
                        filter: {},
                        displayedFilters: [],
                    })
                )
            ).toEqual({
                bar: {
                    sort: 'id',
                    order: 'DESC',
                    page: 1,
                    perPage: 10,
                    filter: {},
                    displayedFilters: [],
                },
                foo: {
                    sort: 'id',
                    order: 'ASC',
                    page: 1,
                    perPage: 10,
                    filter: {},
                    displayedFilters: [],
                },
            });
        });
    });
});
