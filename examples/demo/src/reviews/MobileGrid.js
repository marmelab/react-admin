// in src/comments.js
import React from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';
import { DateField, EditButton, translate } from 'react-admin';

import CustomerReferenceField from '../visitors/CustomerReferenceField';
import StarRatingField from './StarRatingField';
import ProductReferenceField from '../products/ProductReferenceField';
import rowStyle from './rowStyle';

const cardStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    margin: '0.5rem 0',
};

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
                <Card key={id} style={rowStyle(data[id], cardStyle)}>
                    <CardHeader
                        title={
                            <div className={classes.cardTitleContent}>
                                <span>
                                    {translate('resources.reviews.fields.date')}:&nbsp;
                                    <DateField
                                        record={data[id]}
                                        source="date"
                                    />
                                </span>

                                <EditButton
                                    resource="reviews"
                                    basePath={basePath}
                                    record={data[id]}
                                />
                            </div>
                        }
                    />
                    <CardContent className={classes.cardContent}>
                        <span className={classes.cardContentRow}>
                            {translate('resources.reviews.fields.rating', 1)}:&nbsp;
                            <StarRatingField record={data[id]} />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.customers.name', 1)}:&nbsp;
                            <CustomerReferenceField
                                record={data[id]}
                                basePath={basePath}
                            />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.reviews.fields.product_id')}:&nbsp;
                            <ProductReferenceField
                                record={data[id]}
                                basePath={basePath}
                            />
                        </span>
                        {data[id].status === 'pending' && (
                            <span className={classes.cardContentRow}>
                                {translate('resources.reviews.fields.comment')}:<br />
                                {data[id].comment}
                            </span>
                        )}
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
