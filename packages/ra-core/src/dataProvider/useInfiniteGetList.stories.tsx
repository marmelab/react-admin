import * as React from 'react';
import { useInfiniteGetList } from '..';

import { CoreAdminContext } from '../core';
import { countries } from '../storybook/data';

export default { title: 'ra-core/dataProvider/useInfiniteGetList' };

export const UseInfiniteListCore = props => {
    let { dataProvider, ...rest } = props;

    if (!dataProvider) {
        dataProvider = {
            getList: (resource, params) => {
                return Promise.resolve({
                    data: countries.slice(
                        (params.pagination.page - 1) *
                            params.pagination.perPage,
                        (params.pagination.page - 1) *
                            params.pagination.perPage +
                            params.pagination.perPage
                    ),
                    total: countries.length,
                });
            },
        } as any;
    }

    return (
        <CoreAdminContext dataProvider={dataProvider}>
            <UseInfiniteComponent {...rest} />
        </CoreAdminContext>
    );
};

const UseInfiniteComponent = ({
    resource = 'countries',
    pagination = { page: 1, perPage: 20 },
    sort = { field: 'id', order: 'DESC' },
    filter = {},
    options = {},
    meta = undefined,
    callback = null,
    ...rest
}) => {
    const { data, fetchNextPage, hasNextPage } = useInfiniteGetList(
        resource,
        { pagination, sort, filter, meta },
        options
    );

    return (
        <>
            <ul>
                {data?.pages.map(page => {
                    return page.data.map(country => (
                        <li aria-label="country" key={country.code}>
                            {country.name} -- {country.code}
                        </li>
                    ));
                })}
            </ul>
            <div>
                <button
                    aria-label="refetch-button"
                    disabled={!hasNextPage}
                    onClick={() => fetchNextPage()}
                >
                    Refetch
                </button>
            </div>
        </>
    );
};
