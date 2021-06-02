import * as React from 'react';
import {
    List,
    ListProps,
    Filter,
    SearchInput,
    SelectInput,
    TopToolbar,
    CreateButton,
    ExportButton,
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
                filters={<DealFilters />}
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

const DealFilters = (props: any) => (
    <Filter {...props}>
        <SearchInput source="q" alwaysOn />
        <OnlyMineInput alwaysOn />
        <SelectInput source="type" choices={typeChoices} />
    </Filter>
);

const useActionStyles = makeStyles(theme => ({
    createButton: {
        marginLeft: theme.spacing(2),
    },
}));
const DealActions = (props: any) => {
    const classes = useActionStyles();
    return (
        <TopToolbar>
            <DealFilters context="button" />
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
