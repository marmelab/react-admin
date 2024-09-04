import * as React from 'react';
import LockIcon from '@mui/icons-material/Lock';
import History from '@mui/icons-material/History';
import { Box, Button } from '@mui/material';
import { useTranslate } from 'ra-core';

export const DefaultUnauthorizedView = () => {
    const translate = useTranslate();
    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: { sm: '1em', md: 0 },
                fontFamily: 'Roboto, sans-serif',
                opacity: 0.5,
                '& h1': {
                    display: 'flex',
                    alignItems: 'center',
                },
            }}
        >
            <h1 role="alert">
                <LockIcon
                    sx={{
                        width: '2em',
                        height: '2em',
                        marginRight: '0.5em',
                    }}
                />
                {translate('ra.page.unauthorized')}
            </h1>
            <div>{translate('ra.message.unauthorized')}</div>
            <Box
                sx={{
                    marginTop: '2em',
                }}
            >
                <Button
                    variant="contained"
                    startIcon={<History />}
                    onClick={goBack}
                >
                    {translate('ra.action.back')}
                </Button>
            </Box>
        </Box>
    );
};

function goBack() {
    window.history.go(-1);
}
