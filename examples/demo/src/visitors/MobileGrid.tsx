// in src/comments.js
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import {
    DateField,
    EditButton,
    useTranslate,
    NumberField,
    useListContext,
} from 'react-admin';

import AvatarField from './AvatarField';
import ColoredNumberField from './ColoredNumberField';
import SegmentsField from './SegmentsField';
import { Customer } from '../types';

const PREFIX = 'MobileGrid';

const classes = {
    root: `${PREFIX}-root`,
    card: `${PREFIX}-card`,
    cardTitleContent: `${PREFIX}-cardTitleContent`,
    cardContent: `${PREFIX}-cardContent`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: { margin: '1em' },

    [`& .${classes.card}`]: {
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        margin: '0.5rem 0',
    },

    [`& .${classes.cardTitleContent}`]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },

    [`& .${classes.cardContent}`]: {
        ...theme.typography.body1,
        display: 'flex',
        flexDirection: 'column',
    },
}));

const MobileGrid = () => {
    const translate = useTranslate();
    const { data, isLoading } = useListContext<Customer>();

    if (isLoading || data.length === 0) {
        return null;
    }

    return (
        <Root className={classes.root}>
            {data.map(record => (
                <Card key={record.id} className={classes.card}>
                    <CardHeader
                        title={
                            <div className={classes.cardTitleContent}>
                                <h2>{`${record.first_name} ${record.last_name}`}</h2>
                                <EditButton record={record} />
                            </div>
                        }
                        avatar={<AvatarField record={record} size="45" />}
                    />
                    <CardContent className={classes.cardContent}>
                        <div>
                            {translate(
                                'resources.customers.fields.last_seen_gte'
                            )}
                            &nbsp;
                            <DateField record={record} source="last_seen" />
                        </div>
                        <div>
                            {translate(
                                'resources.commands.name',
                                record.nb_commands || 1
                            )}
                            &nbsp;:&nbsp;
                            <NumberField
                                record={record}
                                source="nb_commands"
                                label="resources.customers.fields.commands"
                            />
                        </div>
                        <div>
                            {translate(
                                'resources.customers.fields.total_spent'
                            )}
                            &nbsp; :{' '}
                            <ColoredNumberField
                                record={record}
                                source="total_spent"
                                options={{ style: 'currency', currency: 'USD' }}
                            />
                        </div>
                    </CardContent>
                    {record.groups && record.groups.length > 0 && (
                        <CardContent className={classes.cardContent}>
                            <SegmentsField record={record} />
                        </CardContent>
                    )}
                </Card>
            ))}
        </Root>
    );
};

MobileGrid.defaultProps = {
    data: {},
    ids: [],
};

export default MobileGrid;
