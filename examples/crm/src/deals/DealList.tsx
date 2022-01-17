import * as React from 'react';
import { styled } from '@mui/material/styles';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    SearchInput,
    SelectInput,
    TopToolbar,
    useGetIdentity,
} from 'react-admin';
import { matchPath, useLocation } from 'react-router';

import { DealListContent } from './DealListContent';
import { DealCreate } from './DealCreate';
import { DealShow } from './DealShow';
import { OnlyMineInput } from './OnlyMineInput';
import { typeChoices } from './types';

const PREFIX = 'DealList';

const classes = {
    createButton: `${PREFIX}-createButton`,
};

const StyledTopToolbar = styled(TopToolbar)(({ theme }) => ({
    [`& .${classes.createButton}`]: {
        marginLeft: theme.spacing(2),
    },
}));

export const DealList = () => {
    const { identity } = useGetIdentity();
    const location = useLocation();
    const matchCreate = matchPath('/deals/create', location.pathname);
    const matchShow = matchPath('/deals/:id/show', location.pathname);

    return identity ? (
        <>
            <List
                perPage={100}
                sort={{ field: 'index', order: 'ASC' }}
                filters={dealFilters}
                filterDefaultValues={{ sales_id: identity && identity?.id }}
                actions={<DealActions />}
                pagination={false}
                component="div"
            >
                <DealListContent />
            </List>
            <DealCreate open={!!matchCreate} />
            <DealShow open={!!matchShow} id={matchShow?.params.id} />
        </>
    ) : null;
};

const dealFilters = [
    <SearchInput source="q" alwaysOn />,
    <OnlyMineInput alwaysOn />,
    <SelectInput source="type" choices={typeChoices} />,
];

const DealActions = () => {
    return (
        <StyledTopToolbar>
            <FilterButton />
            <ExportButton />
            <CreateButton
                variant="contained"
                label="New Deal"
                className={classes.createButton}
            />
        </StyledTopToolbar>
    );
};
