import * as React from 'react';
import { Box, Paper } from '@mui/material';
import { useListContext } from 'react-admin';

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
    const { data, isLoading } = useListContext<Company>();

    if (isLoading) return null;

    return (
        <Box display="flex" flexWrap="wrap" width="100%" gap={1}>
            {data.map(record => (
                <CompanyCard key={record.id} record={record} />
            ))}
        </Box>
    );
};

export const ImageList = () => {
    const { isLoading } = useListContext();
    return isLoading ? <LoadingGridList /> : <LoadedGridList />;
};
