import * as React from 'react';
import { ReferenceField, useRedirect } from 'react-admin';
import { Box, Card, Typography } from '@mui/material';
import { Draggable } from 'react-beautiful-dnd';

import { LogoField } from '../companies/LogoField';
import { Deal } from '../types';

export const DealCard = ({ deal, index }: { deal: Deal; index: number }) => {
    const redirect = useRedirect();
    if (!deal) return null;

    const handleClick = () => {
        redirect(`/deals/${deal.id}/show`);
    };
    return (
        <Draggable draggableId={String(deal.id)} index={index}>
            {(provided, snapshot) => (
                <Box
                    sx={{ marginBottom: 1 }}
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
                        <Box
                            sx={{
                                padding: 1,
                                display: 'flex',
                            }}
                        >
                            <ReferenceField
                                source="company_id"
                                record={deal}
                                reference="companies"
                                resource="deals"
                            >
                                <LogoField size="small" />
                            </ReferenceField>
                            <Box sx={{ marginLeft: 1 }}>
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
                            </Box>
                        </Box>
                    </Card>
                </Box>
            )}
        </Draggable>
    );
};
