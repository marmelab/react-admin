import * as React from 'react';
import {
    List,
    ListProps,
    TopToolbar,
    ExportButton,
    CreateButton,
    Pagination,
    useGetIdentity,
} from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

import { GridList } from './GridList';
import { CompanyListFilter } from './CompanyListFilter';

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
            <GridList />
        </List>
    ) : null;
};

const useActionStyles = makeStyles(theme => ({
    createButton: {
        marginLeft: theme.spacing(2),
    },
}));
const CompanyListActions = (props: any) => {
    const classes = useActionStyles();
    return (
        <TopToolbar>
            <ExportButton />
            <CreateButton
                basePath="/companies"
                variant="contained"
                label="New Company"
                className={classes.createButton}
            />
        </TopToolbar>
    );
};
