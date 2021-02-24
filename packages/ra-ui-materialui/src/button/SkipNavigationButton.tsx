import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from './Button';
import { useTranslate } from 'ra-core';
import classnames from 'classnames';

const skipToContent = () => {
    if (typeof document === 'undefined') return;
    const element = document.getElementById('main-content');

    if (!element) {
        if (process.env.NODE_ENV !== 'production') {
            console.warn(
                'No element with id "main-content" was found. Ensure the element that contains your main content has an id of "main-content".'
            );
        }

        return;
    }

    element.setAttribute('tabIndex', '-1');
    element.focus();
    element.blur();
    element.removeAttribute('tabIndex');
};

const useStyles = makeStyles(
    theme => ({
        skipToContentButton: {
            position: 'fixed',
            padding: theme.spacing(1),
            backgroundColor: theme.palette.background.default,
            color: theme.palette.getContrastText(
                theme.palette.background.default
            ),
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
    }),
    { name: 'RaSkipToContentButton' }
);

const SkipNavigationButton = () => {
    const classes = useStyles();
    const translate = useTranslate();

    return (
        <Button
            onClick={skipToContent}
            className={classnames(
                classes.skipToContentButton,
                'skip-nav-button'
            )}
            label={translate('ra.navigation.skip_nav')}
            variant="contained"
        />
    );
};

export default SkipNavigationButton;
