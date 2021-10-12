import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReferenceField, useRedirect } from 'react-admin';
import { Card, Typography } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';

import { LogoField } from '../companies/LogoField';
import { Deal } from '../types';

const PREFIX = 'DealCard';

const classes = {
    root: `${PREFIX}-root`,
    cardContent: `${PREFIX}-cardContent`,
    cardText: `${PREFIX}-cardText`,
};

const Root = styled('div')(({ theme }) => ({
    [`&.${classes.root}`]: {
        marginBottom: theme.spacing(1),
    },

    [`& .${classes.cardContent}`]: {
        padding: theme.spacing(1),
        display: 'flex',
    },

    [`& .${classes.cardText}`]: {
        marginLeft: theme.spacing(1),
    },
}));

export const DealCard = ({ deal, index }: { deal: Deal; index: number }) => {
    const redirect = useRedirect();
    if (!deal) return null;

    const handleClick = () => {
        redirect(`/deals/${deal.id}/show`);
    };
    return (
        <Draggable draggableId={String(deal.id)} index={index}>
            {(provided, snapshot) => (
                <Root
                    className={classes.root}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                    onClick={handleClick}
                >
                    <Card
                        style={{
                            opacity: snapshot.isDragging ? 0.9 : 1,
                            transform: snapshot.isDragging
                                ? 'rotate(-2deg)'
                                : '',
                        }}
                        elevation={snapshot.isDragging ? 3 : 1}
                    >
                        <div className={classes.cardContent}>
                            <ReferenceField
                                source="company_id"
                                record={deal}
                                reference="companies"
                                resource="deals"
                                basePath="/deals"
                            >
                                <LogoField size="small" />
                            </ReferenceField>
                            <div className={classes.cardText}>
                                <Typography variant="body2" gutterBottom>
                                    {deal.name}
                                </Typography>
                                <Typography
                                    variant="caption"
                                    color="textSecondary"
                                >
                                    {deal.amount.toLocaleString('en-US', {
                                        notation: 'compact',
                                        style: 'currency',
                                        currency: 'USD',
                                        currencyDisplay: 'narrowSymbol',
                                        minimumSignificantDigits: 3,
                                    })}
                                    , {deal.type}
                                </Typography>
                            </div>
                        </div>
                    </Card>
                </Root>
            )}
        </Draggable>
    );
};
