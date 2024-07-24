import { Droppable } from '@hello-pangea/dnd';
import { Box, Stack, Typography } from '@mui/material';

import { Deal } from '../types';
import { DealCard } from './DealCard';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { findDealLabel } from './deal';

export const DealColumn = ({
    stage,
    deals,
}: {
    stage: string;
    deals: Deal[];
}) => {
    const totalAmount = deals.reduce((sum, deal) => sum + deal.amount, 0);

    const { dealStages } = useConfigurationContext();
    return (
        <Box
            sx={{
                flex: 1,
                paddingTop: '8px',
                paddingBottom: '16px',
                bgcolor: '#eaeaee',
                '&:first-of-type': {
                    paddingLeft: '5px',
                    borderTopLeftRadius: 5,
                },
                '&:last-of-type': {
                    paddingRight: '5px',
                    borderTopRightRadius: 5,
                },
            }}
        >
            <Stack alignItems="center">
                <Typography variant="subtitle1">
                    {findDealLabel(dealStages, stage)}
                </Typography>
                <Typography
                    variant="subtitle1"
                    color="text.secondary"
                    fontSize="small"
                >
                    (
                    {totalAmount.toLocaleString('en-US', {
                        notation: 'compact',
                        style: 'currency',
                        currency: 'USD',
                        currencyDisplay: 'narrowSymbol',
                        minimumSignificantDigits: 3,
                    })}
                    )
                </Typography>
            </Stack>
            <Droppable droppableId={stage}>
                {(droppableProvided, snapshot) => (
                    <Box
                        ref={droppableProvided.innerRef}
                        {...droppableProvided.droppableProps}
                        className={
                            snapshot.isDraggingOver ? ' isDraggingOver' : ''
                        }
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: 1,
                            padding: '5px',
                            '&.isDraggingOver': {
                                bgcolor: '#dadadf',
                            },
                        }}
                    >
                        {deals.map((deal, index) => (
                            <DealCard key={deal.id} deal={deal} index={index} />
                        ))}
                        {droppableProvided.placeholder}
                    </Box>
                )}
            </Droppable>
        </Box>
    );
};
