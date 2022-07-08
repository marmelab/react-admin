import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar';

export const TopToolbar = (props: ToolbarProps) => <StyledToolbar {...props} />;

TopToolbar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default TopToolbar;
const PREFIX = 'RaTopToolbar';

const StyledToolbar = styled(Toolbar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    gap: theme.spacing(1),
    flex: '0 1 auto',
    padding: theme.spacing(0.5),
    minHeight: theme.spacing(6),
    [theme.breakpoints.down('md')]: {
        flex: '0 1 100%',
        padding: `${theme.spacing(0.5)} ${theme.spacing(0.5)} ${theme.spacing(
            1
        )} ${theme.spacing(0.5)}`,
        minHeight: 'unset',
    },
    [theme.breakpoints.down('sm')]: {
        backgroundColor: theme.palette.background.paper,
    },
}));
