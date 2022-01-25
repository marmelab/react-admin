// in src/comments.js
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { Card, CardHeader, CardContent } from '@mui/material';
import {
    DateField,
    EditButton,
    NumberField,
    TextField,
    BooleanField,
    useTranslate,
    RaRecord,
} from 'react-admin';

import CustomerReferenceField from '../visitors/CustomerReferenceField';

const PREFIX = 'MobileGrid';

const classes = {
    card: `${PREFIX}-card`,
    cardTitleContent: `${PREFIX}-cardTitleContent`,
    cardContent: `${PREFIX}-cardContent`,
    cardContentRow: `${PREFIX}-cardContentRow`,
};

const Root = styled('div')(({ theme }) => ({
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

    [`& .${classes.cardContent}`]: theme.typography.body1,

    [`& .${classes.cardContentRow}`]: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        margin: '0.5rem 0',
    },
}));

interface MobileGridProps {
    data?: RaRecord[];
}

const MobileGrid = (props: MobileGridProps) => {
    const { data } = props;
    const translate = useTranslate();

    if (!data) {
        return null;
    }

    return (
        <Root style={{ margin: '1em' }}>
            {data.map(record => (
                <Card key={record.id} className={classes.card}>
                    <CardHeader
                        title={
                            <div className={classes.cardTitleContent}>
                                <span>
                                    {translate('resources.commands.name', 1)}
                                    :&nbsp;
                                    <TextField
                                        record={record}
                                        source="reference"
                                    />
                                </span>
                                <EditButton
                                    resource="commands"
                                    record={record}
                                />
                            </div>
                        }
                    />
                    <CardContent className={classes.cardContent}>
                        <span className={classes.cardContentRow}>
                            {translate('resources.customers.name', 1)}:&nbsp;
                            <CustomerReferenceField record={record} />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.reviews.fields.date')}:&nbsp;
                            <DateField record={record} source="date" showTime />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate(
                                'resources.commands.fields.basket.total'
                            )}
                            :&nbsp;
                            <NumberField
                                record={record}
                                source="total"
                                options={{ style: 'currency', currency: 'USD' }}
                            />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.commands.fields.status')}
                            :&nbsp;
                            <TextField source="status" record={record} />
                        </span>
                        <span className={classes.cardContentRow}>
                            {translate('resources.commands.fields.returned')}
                            :&nbsp;
                            <BooleanField record={record} source="returned" />
                        </span>
                    </CardContent>
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
