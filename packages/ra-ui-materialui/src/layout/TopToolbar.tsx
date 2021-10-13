import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar';
import classnames from 'classnames';

export const TopToolbar = (props: ToolbarProps) => {
    const { className, ...rest } = props;

    return (
        <StyledToolbar
            className={classnames(TopToolbarClasses.root, className)}
            {...rest}
        />
    );
};

TopToolbar.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default TopToolbar;
const PREFIX = 'RaTopToolbar';

export const TopToolbarClasses = {
    root: `${PREFIX}-root`,
};

const StyledToolbar = styled(Toolbar, { name: PREFIX })(({ theme }) => ({
    [`&.${TopToolbarClasses.root}`]: {
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(1),
        minHeight: theme.spacing(5),
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
    },
}));
