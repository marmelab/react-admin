import * as React from 'react';
import { ReferenceField, useRedirect } from 'react-admin';
import { Box, Card, Typography } from '@mui/material';
import { Draggable } from '@hello-pangea/dnd';
import { Deal } from '../types';
import { CompanyAvatar } from '../companies/CompanyAvatar';

export const DealCard = ({ deal, index }: { deal: Deal; index: number }) => {
    if (!deal) return null;

    return (
        <Draggable draggableId={String(deal.id)} index={index}>
            {(provided, snapshot) => (
                <DealCardContent
                    provided={provided}
                    snapshot={snapshot}
                    deal={deal}
                />
            )}
        </Draggable>
    );
};

export const DealCardContent = ({
    provided,
    snapshot,
    deal,
}: {
    provided?: any;
    snapshot?: any;
    deal: Deal;
}) => {
    const redirect = useRedirect();
    const handleClick = () => {
        redirect(`/deals/${deal.id}/show`, undefined, undefined, undefined, {
            _scrollToTop: false,
        });
    };

    return (
        <Box
            sx={{ marginBottom: 1, cursor: 'pointer' }}
            {...provided?.draggableProps}
            {...provided?.dragHandleProps}
            ref={provided?.innerRef}
            onClick={handleClick}
        >
            <Card
                style={{
                    opacity: snapshot?.isDragging ? 0.9 : 1,
                    transform: snapshot?.isDragging ? 'rotate(-2deg)' : '',
                }}
                elevation={snapshot?.isDragging ? 3 : 1}
            >
                <Box padding={1} display="flex">
                    <ReferenceField
                        source="company_id"
                        record={deal}
                        reference="companies"
                    >
                        <CompanyAvatar width={20} height={20} />
                    </ReferenceField>
                    <Box sx={{ marginLeft: 1 }}>
                        <Typography variant="body2" gutterBottom>
                            {deal.name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                            {deal.amount.toLocaleString('en-US', {
                                notation: 'compact',
                                style: 'currency',
                                currency: 'USD',
                                currencyDisplay: 'narrowSymbol',
                                minimumSignificantDigits: 3,
                            })}
                            , {deal.category}
                        </Typography>
                    </Box>
                </Box>
            </Card>
        </Box>
    );
};
