// in src/comments.js
import React from 'react';
import {
    DateField,
    EditButton,
    translate,
    NumberField,
    TextField,
    BooleanField,
} from 'react-admin';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import CustomerReferenceField from '../visitors/CustomerReferenceField';
import NbItemsField from './NbItemsField';

const listStyles = theme => ({
    card: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5rem 0',
    },
    cardContent: theme.typography.body1,
    cardContentItem: {
        padding: '0 2rem',
    },
    cardActions: {
        justifyContent: 'flex-end',
    },
    cardContentRow: {
        display: 'flex',
        flexDirection: 'rows',
        alignItems: 'center',
        margin: '0.5rem',
    },
});

const MobileGrid = withStyles(listStyles)(
    translate(({ classes, ids, data, basePath, translate }) => (
        <div style={{ margin: '1em' }}>
            {ids.map(id => (
                <Card key={id} className={classes.card}>
                    <CardHeader
                        title={
                            <span>
                                {translate('resources.commands.name', 1)}:&nbsp;
                                <TextField
                                    record={data[id]}
                                    source="reference"
                                />
                            </span>
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
                                'resources.commands.fields.basket.quantity'
                            )}:&nbsp;
                            <NbItemsField record={data[id]} />
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
                    <CardActions className={classes.cardActions}>
                        <EditButton
                            resource="commands"
                            basePath={basePath}
                            record={data[id]}
                        />
                    </CardActions>
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
