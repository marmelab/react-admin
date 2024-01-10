import React from 'react';
import { styled } from '@mui/material/styles';
import { Button } from './Button';

export const SkipNavigationButton = () => {
    return (
        <StyledButton
            onClick={skipToContent}
            className={'skip-nav-button'}
            label="ra.navigation.skip_nav"
            variant="contained"
        />
    );
};

const PREFIX = 'RaSkipNavigationButton';

const StyledButton = styled(Button, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
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
}));

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
