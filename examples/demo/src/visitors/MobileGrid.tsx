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
    Identifier,
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

interface Props {
    ids?: Identifier[];
    data?: { [key: string]: Customer };
    basePath?: string;
}

const MobileGrid = ({ ids, data, basePath }: Props) => {
    const translate = useTranslate();

    if (!ids || !data) {
        return null;
    }

    return (
        <Root className={classes.root}>
            {ids.map(id => (
                <Card key={id} className={classes.card}>
                    <CardHeader
                        title={
                            <div className={classes.cardTitleContent}>
                                <h2>{`${data[id].first_name} ${data[id].last_name}`}</h2>
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
                            {translate(
                                'resources.customers.fields.last_seen_gte'
                            )}
                            &nbsp;
                            <DateField record={data[id]} source="last_seen" />
                        </div>
                        <div>
                            {translate(
                                'resources.commands.name',
                                data[id].nb_commands || 1
                            )}
                            &nbsp;:&nbsp;
                            <NumberField
                                record={data[id]}
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
                                record={data[id]}
                                source="total_spent"
                                options={{ style: 'currency', currency: 'USD' }}
                            />
                        </div>
                    </CardContent>
                    {data[id].groups && data[id].groups.length > 0 && (
                        <CardContent className={classes.cardContent}>
                            <SegmentsField record={data[id]} />
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
