import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { warning } from 'ra-core';
import classnames from 'classnames';

const PREFIX = 'RaCardActions';

const classes = {
    cardActions: `${PREFIX}-cardActions`,
};

const Root = styled('div')({
    [`&.${classes.cardActions}`]: {
        zIndex: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        padding: 0,
    },
});

const CardActions = props => {
    const { className, children, ...rest } = props;
    warning(
        true,
        '<CardActions> is deprecated. Please use the <TopToolbar> component instead to wrap your action buttons'
    );

    return (
        <Root className={classnames(classes.cardActions, className)} {...rest}>
            {children}
        </Root>
    );
};

CardActions.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

export default CardActions;
