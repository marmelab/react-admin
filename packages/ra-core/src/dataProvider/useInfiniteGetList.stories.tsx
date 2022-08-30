import * as React from 'react';
import {
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Button,
} from '@mui/material';
import { useInfiniteGetList } from '..';

import { CoreAdminContext } from '../core';
import { countries } from '../storybook/data';

export default { title: 'ra-core/dataProvider/useInfiniteGetList' };

export const Basic = props => {
    let { dataProvider, ...rest } = props;

    if (!dataProvider) {
        dataProvider = {
            getList: (resource, params) => {
                return new Promise(resolve => {
                    setTimeout(
                        () =>
                            resolve({
                                data: countries.slice(
                                    (params.pagination.page - 1) *
                                        params.pagination.perPage,
                                    (params.pagination.page - 1) *
                                        params.pagination.perPage +
                                        params.pagination.perPage
                                ),
                                total: countries.length,
                            }),
                        300
                    );
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
    pagination = { page: 1, perPage: 10 },
    sort = { field: 'id', order: 'DESC' },
    filter = {},
    options = {},
    meta = undefined,
    ...rest
}) => {
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteGetList(
        resource,
        { pagination, sort, filter, meta },
        options
    );

    return (
        <div style={{ width: 250, margin: 'auto' }}>
            <List dense>
                {data?.pages.map(page => {
                    return page.data.map(country => (
                        <ListItem
                            aria-label="country"
                            disablePadding
                            key={country.code}
                        >
                            <ListItemIcon sx={{ minWidth: 30 }}>
                                {country.emoji}
                            </ListItemIcon>
                            <ListItemText>
                                {country.name} -- {country.code}
                            </ListItemText>
                        </ListItem>
                    ));
                })}
            </List>
            <div>
                {hasNextPage && (
                    <Button
                        color="primary"
                        aria-label="refetch-button"
                        disabled={isFetchingNextPage}
                        onClick={() => fetchNextPage()}
                    >
                        Fetch next page
                    </Button>
                )}
            </div>
        </div>
    );
};

export const PageInfo = props => {
    let { dataProvider, ...rest } = props;

    if (!dataProvider) {
        dataProvider = {
            getList: (resource, params) => {
                return new Promise(resolve => {
                    setTimeout(
                        () =>
                            resolve({
                                data: countries.slice(
                                    (params.pagination.page - 1) *
                                        params.pagination.perPage,
                                    (params.pagination.page - 1) *
                                        params.pagination.perPage +
                                        params.pagination.perPage
                                ),
                                // no total here
                                pageInfo: {
                                    hasNextPage:
                                        countries.length >
                                        params.pagination.page *
                                            params.pagination.perPage,
                                    hasPreviousPage: params.pagination.page > 1,
                                },
                            }),
                        300
                    );
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
