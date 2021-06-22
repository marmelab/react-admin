import * as React from 'react';
import {
    CreateButton,
    ExportButton,
    FilterButton,
    List,
    ListProps,
    SearchInput,
    SelectInput,
    TopToolbar,
    useGetIdentity,
} from 'react-admin';
import { Route } from 'react-router';
import { makeStyles } from '@material-ui/core/styles';

import { DealListContent } from './DealListContent';
import { DealCreate } from './DealCreate';
import { DealShow } from './DealShow';
import { OnlyMineInput } from './OnlyMineInput';
import { typeChoices } from './types';

export const DealList = (props: ListProps) => {
    const { identity } = useGetIdentity();
    return identity ? (
        <>
            <List
                {...props}
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
            <Route path="/deals/create">
                {({ match }) => <DealCreate open={!!match} />}
            </Route>
            <Route path="/deals/:id/show">
                {({ match }) =>
                    !!match ? (
                        <DealShow open={!!match} id={match?.params?.id} />
                    ) : null
                }
            </Route>
        </>
    ) : null;
};

const dealFilters = [
    <SearchInput source="q" alwaysOn />,
    <OnlyMineInput alwaysOn />,
    <SelectInput source="type" choices={typeChoices} />,
];

const useActionStyles = makeStyles(theme => ({
    createButton: {
        marginLeft: theme.spacing(2),
    },
}));
const DealActions = () => {
    const classes = useActionStyles();
    return (
        <TopToolbar>
            <FilterButton />
            <ExportButton />
            <CreateButton
                basePath="/deals"
                variant="contained"
                label="New Deal"
                className={classes.createButton}
            />
        </TopToolbar>
    );
};
