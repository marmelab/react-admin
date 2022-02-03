import React from 'react';
import { styled } from '@mui/material/styles';
import { Tabs, Tab, Toolbar, AppBar, Box, Typography } from '@mui/material';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { UserMenu, Logout, LoadingIndicator } from 'react-admin';

const PREFIX = 'Header';

const classes = {
    root: `${PREFIX}-root`,
    logo: `${PREFIX}-logo`,
};

const Root = styled('nav')({
    [`&.${classes.root}`]: {
        flexGrow: 1,
    },
    [`& .${classes.logo}`]: {
        height: 30,
        marginRight: '1em',
    },
});

const Header = () => {
    const location = useLocation();

    let currentPath = '/';
    if (!!matchPath('/contacts/*', location.pathname)) {
        currentPath = '/contacts';
    } else if (!!matchPath('/companies/*', location.pathname)) {
        currentPath = '/companies';
    } else if (!!matchPath('/deals/*', location.pathname)) {
        currentPath = '/deals';
    }

    return (
        <Root className={classes.root}>
            <AppBar position="static" color="primary">
                <Toolbar variant="dense">
                    <Box flex={1} display="flex" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <img
                                className={classes.logo}
                                src={
                                    'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg'
                                }
                                alt="Bosch Logo"
                            />
                            <Typography component="span" variant="h5">
                                Atomic CRM
                            </Typography>
                        </Box>
                        <Box>
                            <Tabs
                                value={currentPath}
                                aria-label="Navigation Tabs"
                                indicatorColor="secondary"
                                textColor="inherit"
                            >
                                <Tab
                                    label={'Dashboard'}
                                    component={Link}
                                    to="/"
                                    value="/"
                                />
                                <Tab
                                    label={'Contacts'}
                                    component={Link}
                                    to="/contacts"
                                    value="/contacts"
                                />
                                <Tab
                                    label={'Companies'}
                                    component={Link}
                                    to="/companies"
                                    value="/companies"
                                />
                                <Tab
                                    label={'Deals'}
                                    component={Link}
                                    to="/deals"
                                    value="/deals"
                                />
                            </Tabs>
                        </Box>
                        <Box display="flex">
                            <LoadingIndicator />
                            <UserMenu logout={<Logout />} />
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </Root>
    );
};

export default Header;
