// in src/comments.js
import React from 'react';
import { DateField, EditButton, translate, NumberField } from 'react-admin';
import Card, { CardHeader, CardContent, CardActions } from 'material-ui/Card';
import { withStyles } from 'material-ui/styles';
import AvatarField from './AvatarField';
import { ColoredNumberField } from './index';

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
                        title={`${data[id].firstName} ${data[id].lastName}`}
                        subheader={
                            <span>
                                {translate(
                                    'resources.customers.fields.lastSeen_gte'
                                )}&nbsp;
                                <DateField
                                    record={data[id]}
                                    source="lastSeen"
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
                                parseInt(data[id].nbCommands, 10) || 1
                            )}&nbsp;:&nbsp;<NumberField
                                record={data[id]}
                                source="nbCommands"
                                label="resources.customers.fields.commands"
                                className={classes.nb_commands}
                            />
                        </span>
                        {translate(
                            'resources.customers.fields.totalSpent'
                        )}&nbsp; :{' '}
                        <ColoredNumberField
                            record={data[id]}
                            source="totalSpent"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                    </CardContent>
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
