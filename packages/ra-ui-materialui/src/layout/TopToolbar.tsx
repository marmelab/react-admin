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
    paddingBottom: theme.spacing(1),
    gap: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
        minHeight: theme.spacing(6),
    },
    [theme.breakpoints.up('xs')]: {
        paddingLeft: 0,
        paddingRight: 0,
    },
    [theme.breakpoints.down('md')]: {
        paddingRight: theme.spacing(2),
    },
    [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
        backgroundColor: theme.palette.background.paper,
    },
}));
