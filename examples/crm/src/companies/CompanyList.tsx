import * as React from 'react';
import { styled } from '@mui/material/styles';
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

const PREFIX = 'CompanyList';

const classes = {
    createButton: `${PREFIX}-createButton`,
};

const StyledTopToolbar = styled(TopToolbar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${classes.createButton}`]: {
        marginLeft: theme.spacing(2),
    },
}));

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
        <StyledTopToolbar>
            <ExportButton />
            <CreateButton
                variant="contained"
                label="New Company"
                className={classes.createButton}
            />
        </StyledTopToolbar>
    );
};
