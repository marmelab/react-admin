// in src/comments.js
import React from 'react';
import compose from 'recompose/compose';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import { withStyles } from '@material-ui/core/styles';
import { DateField, EditButton, translate, NumberField } from 'react-admin';

import AvatarField from './AvatarField';
import ColoredNumberField from './ColoredNumberField';
import SegmentsField from './SegmentsField';

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
    cardContent: {
        ...theme.typography.body1,
        display: 'flex',
        flexDirection: 'column',
    },
});

const MobileGrid = ({ classes, ids, data, basePath, translate }) => (
    <div style={{ margin: '1em' }}>
        {ids.map(id => (
            <Card key={id} className={classes.card}>
                <CardHeader
                    title={
                        <div className={classes.cardTitleContent}>
                            <h2>{`${data[id].first_name} ${
                                data[id].last_name
                            }`}</h2>
                            <EditButton
                                resource="visitors"
                                basePath={basePath}
                                record={data[id]}
                            />
                        </div>
                    }
                    avatar={<AvatarField record={data[id]} size="45" />}
                />
                <CardContent className={classes.cardContent}>
                    <div>
                        {translate('resources.customers.fields.last_seen_gte')}&nbsp;
                        <DateField
                            record={data[id]}
                            source="last_seen"
                            type="date"
                        />
                    </div>
                    <div>
                        {translate(
                            'resources.commands.name',
                            parseInt(data[id].nb_commands, 10) || 1
                        )}&nbsp;:&nbsp;<NumberField
                            record={data[id]}
                            source="nb_commands"
                            label="resources.customers.fields.commands"
                            className={classes.nb_commands}
                        />
                    </div>
                    <div>
                        {translate('resources.customers.fields.total_spent')}&nbsp;
                        :{' '}
                        <ColoredNumberField
                            record={data[id]}
                            source="total_spent"
                            options={{ style: 'currency', currency: 'USD' }}
                        />
                    </div>
                </CardContent>
                {data[id].groups &&
                    data[id].groups.length > 0 && (
                        <CardContent className={classes.cardContent}>
                            <SegmentsField record={data[id]} />
                        </CardContent>
                    )}
            </Card>
        ))}
    </div>
);

MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

const enhance = compose(
    withStyles(listStyles),
    translate
);

export default enhance(MobileGrid);
