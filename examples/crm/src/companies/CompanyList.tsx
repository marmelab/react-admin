import * as React from 'react';
import {
    List,
    TopToolbar,
    ExportButton,
    CreateButton,
    Pagination,
    useGetIdentity,
} from 'react-admin';

import { ImageList } from './GridList';
import { CompanyListFilter } from './CompanyListFilter';

export const CompanyList = () => {
    const { identity } = useGetIdentity();
    return identity ? (
        <List
            actions={<CompanyListActions />}
            aside={<CompanyListFilter />}
            filterDefaultValues={{ sales_id: identity?.id }}
            pagination={<Pagination rowsPerPageOptions={[15, 25, 50, 100]} />}
            perPage={25}
            sort={{ field: 'name', order: 'ASC' }}
            component="div"
        >
            <ImageList />
        </List>
    ) : null;
};

const CompanyListActions = () => {
    return (
        <TopToolbar>
            <ExportButton />
            <CreateButton
                variant="contained"
                label="New Company"
                sx={{ marginLeft: 2 }}
            />
        </TopToolbar>
    );
};
