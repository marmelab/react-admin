import * as React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { RecordContextProvider, useListContext } from 'react-admin';

import { CompanyCard } from './CompanyCard';
import { Company } from '../types';

const times = (nbChildren: number, fn: (key: number) => any) =>
    Array.from({ length: nbChildren }, (_, key) => fn(key));

const LoadingGridList = () => (
    <Box display="flex" flexWrap="wrap" width={1008} gap={1}>
        {times(15, key => (
            <Paper
                sx={{
                    height: 200,
                    width: 194,
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'grey[200]',
                }}
                key={key}
            />
        ))}
    </Box>
);

const LoadedGridList = () => {
    const { data, error, isPending } = useListContext<Company>();

    if (isPending || error) return null;

    return (
        <Box
            width="100%"
            gap={1}
            display="grid"
            gridTemplateColumns="repeat(auto-fill, minmax(180px, 1fr))"
        >
            {data.map(record => (
                <RecordContextProvider key={record.id} value={record}>
                    <CompanyCard />
                </RecordContextProvider>
            ))}

            {data.length === 0 && (
                <Typography p={2}>No companies found</Typography>
            )}
        </Box>
    );
};

export const ImageList = () => {
    const { isPending } = useListContext();
    return isPending ? <LoadingGridList /> : <LoadedGridList />;
};
