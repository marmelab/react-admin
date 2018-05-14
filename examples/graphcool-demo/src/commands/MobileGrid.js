// in src/comments.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';
import {
    DateField,
    EditButton,
    translate,
    NumberField,
    TextField,
    BooleanField,
} from 'react-admin';

import CustomerReferenceField from '../visitors/CustomerReferenceField';

const listStyles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5rem 0',
    },
    cardTitleContent: {
        display: 'flex',
        flexDirection: 'rows',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardContent: theme.typography.body1,
    cardContentRow: {
        display: 'flex',
        flexDirection: 'rows',
        alignItems: 'center',
        margin: '0.5rem 0',
    },
});

const MobileGrid = withStyles(listStyles)(
    translate(({ classes, ids, data, basePath, translate }) => (
        <div style={{ margin: '1em' }}>
            {ids.map(id => (
                <Card key={id} className={classes.card}>
                    <CardHeader
                        title={
                            <div className={classes.cardTitleContent}>
                                <span>
                                    {translate(
                                        'resources.commands.name',
                                        1
                                    )}:&nbsp;
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
                            )}:&nbsp;
                            <NumberField
                                record={data[id]}
                                source="total"
                                options={{ style: 'currency', currency: 'USD' }}
                                className={classes.total}
                            />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate(
                                'resources.commands.fields.status'
                            )}:&nbsp;
                            <TextField source="status" record={data[id]} />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate(
                                'resources.commands.fields.returned'
                            )}:&nbsp;
                            <BooleanField record={data[id]} source="returned" />
                        </span>
                    </CardContent>
                </Card>
            ))}
        </div>
    ))
);

MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

export default MobileGrid;
