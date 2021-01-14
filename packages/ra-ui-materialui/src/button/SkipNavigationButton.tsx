import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from './Button';
import { HashLink as Link } from 'react-router-hash-link';
import { useTranslate } from 'ra-core';

const useStyles = makeStyles(theme => ({
    skipToContentButton: {
        position: 'fixed',
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
        color: theme.palette.getContrastText(theme.palette.background.default),
        transition: theme.transitions.create(['top', 'opacity'], {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.leavingScreen,
        }),
        left: theme.spacing(2),
        top: theme.spacing(-10),
        zIndex: 5000,
        '&:hover': {
            opacity: 0.8,
            backgroundColor: theme.palette.background.default,
        },
        '&:focus': {
            top: theme.spacing(2),
            transition: theme.transitions.create(['top', 'opacity'], {
                easing: theme.transitions.easing.easeOut,
                duration: theme.transitions.duration.enteringScreen,
            }),
        },
    },
}));

function SkipNavigationButton() {
    const classes = useStyles();
    const translate = useTranslate();

    return (
        <Button
            component={Link}
            to="#main-content"
            className={classes.skipToContentButton}
            label={translate('ra.navigation.skip_nav')}
            variant="contained"
        />
    );
}

export default SkipNavigationButton;
