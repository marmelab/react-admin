// in src/comments.js
import React from 'react';
import { DateField, EditButton, translate, NumberField } from 'react-admin';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import AvatarField from './AvatarField';
import { ColoredNumberField } from './index';
import SegmentsField from './SegmentsField';

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
});

const MobileGrid = withStyles(listStyles)(
    translate(({ classes, ids, data, basePath, translate }) => (
        <div style={{ margin: '1em' }}>
            {ids.map(id => (
                <Card key={id} className={classes.card}>
                    <CardHeader
                        title={`${data[id].first_name} ${data[id].last_name}`}
                        subheader={
                            <span>
                                {translate(
                                    'resources.customers.fields.last_seen_gte'
                                )}&nbsp;
                                <DateField
                                    record={data[id]}
                                    source="last_seen"
                                    type="date"
                                />
                            </span>
                        }
                        avatar={<AvatarField record={data[id]} size="45" />}
                    />
                    <CardContent className={classes.cardContent}>
                        <span className={classes.cardContentItem}>
                            {translate(
                                'resources.commands.name',
                                parseInt(data[id].nb_commands, 10) || 1
                            )}&nbsp;:&nbsp;<NumberField
                                record={data[id]}
                                source="nb_commands"
                                label="resources.customers.fields.commands"
                                className={classes.nb_commands}
                            />
                        </span>
                        {translate(
                            'resources.customers.fields.total_spent'
                        )}&nbsp; :{' '}
                        <ColoredNumberField
                            record={data[id]}
                            source="total_spent"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                    </CardContent>
                    {data[id].groups &&
                        data[id].groups.length > 0 && (
                            <CardContent className={classes.cardContent}>
                                <SegmentsField record={data[id]} />
                            </CardContent>
                        )}
                    <CardActions className={classes.cardActions}>
                        <EditButton
                            resource="visitors"
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
