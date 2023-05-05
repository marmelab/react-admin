import * as React from 'react';
import { AppBar, TitlePortal, ToggleThemeButton } from 'react-admin';
import { Box, useMediaQuery, Theme } from '@mui/material';

import Logo from './Logo';

const CustomAppBar = () => {
    const isLargeEnough = useMediaQuery<Theme>(theme =>
        theme.breakpoints.up('sm')
    );
    return (
        <AppBar color="secondary" elevation={1}>
            <TitlePortal />
            {isLargeEnough && <Logo />}
            {isLargeEnough && <Box component="span" sx={{ flex: 1 }} />}
            <ToggleThemeButton />
        </AppBar>
    );
};

export default CustomAppBar;
