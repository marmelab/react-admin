import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    List,
    ListProps,
    TopToolbar,
    ExportButton,
    CreateButton,
    Pagination,
    useGetIdentity,
} from 'react-admin';

import { ImageList } from './GridList';
import { CompanyListFilter } from './CompanyListFilter';

const PREFIX = 'CompanyList';

const classes = {
    createButton: `${PREFIX}-createButton`,
};

const StyledTopToolbar = styled(TopToolbar)(({ theme }) => ({
    [`& .${classes.createButton}`]: {
        marginLeft: theme.spacing(2),
    },
}));

export const CompanyList = (props: ListProps) => {
    const { identity } = useGetIdentity();
    return identity ? (
        <List
            {...props}
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

const CompanyListActions = (props: any) => {
    return (
        <StyledTopToolbar>
            <ExportButton />
            <CreateButton
                basePath="/companies"
                variant="contained"
                label="New Company"
                className={classes.createButton}
            />
        </StyledTopToolbar>
    );
};
