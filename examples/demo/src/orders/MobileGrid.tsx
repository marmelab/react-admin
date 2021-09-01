// in src/comments.js
import * as React from 'react';
import { Card, CardHeader, CardContent } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {
    DateField,
    EditButton,
    NumberField,
    TextField,
    BooleanField,
    useTranslate,
    RecordMap,
    Identifier,
    Record,
} from 'react-admin';

import CustomerReferenceField from '../visitors/CustomerReferenceField';

const useListStyles = makeStyles(theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5rem 0',
    },
    cardTitleContent: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: theme.typography.body1,
    cardContentRow: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '0.5rem 0',
    },
}));

interface MobileGridProps {
    ids?: Identifier[];
    data?: RecordMap<Record>;
    basePath?: string;
}

const MobileGrid = (props: MobileGridProps) => {
    const { ids, data, basePath } = props;
    const translate = useTranslate();
    const classes = useListStyles();

    if (!ids || !data || !basePath) {
        return null;
    }

    return (
        <div style={{ margin: '1em' }}>
            {ids.map(id => (
                <Card key={id} className={classes.card}>
                    <CardHeader
                        title={
                            <div className={classes.cardTitleContent}>
                                <span>
                                    {translate('resources.commands.name', 1)}
                                    :&nbsp;
                                    <TextField
                                        record={data[id]}
                                        source="reference"
                                    />
                                </span>
                                <EditButton
                                    resource="commands"
                                    basePath={basePath}
                                    record={data[id]}
                                />
                            </div>
                        }
                    />
                    <CardContent className={classes.cardContent}>
                        <span className={classes.cardContentRow}>
                            {translate('resources.customers.name', 1)}:&nbsp;
                            <CustomerReferenceField
                                record={data[id]}
                                basePath={basePath}
                            />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.reviews.fields.date')}:&nbsp;
                            <DateField
                                record={data[id]}
                                source="date"
                                showTime
                            />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate(
                                'resources.commands.fields.basket.total'
                            )}
                            :&nbsp;
                            <NumberField
                                record={data[id]}
                                source="total"
                                options={{ style: 'currency', currency: 'USD' }}
                            />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.commands.fields.status')}
                            :&nbsp;
                            <TextField source="status" record={data[id]} />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.commands.fields.returned')}
                            :&nbsp;
                            <BooleanField record={data[id]} source="returned" />
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

export default MobileGrid;
