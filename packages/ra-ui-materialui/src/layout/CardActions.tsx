import * as React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { warning } from 'ra-core';
import classnames from 'classnames';

export const CardActions = props => {
    const { className, children, ...rest } = props;
    warning(
        true,
        '<CardActions> is deprecated. Please use the <TopToolbar> component instead to wrap your action buttons'
    );

    return (
        <Root
            className={classnames(CardActionsClasses.cardActions, className)}
            {...rest}
        >
            {children}
        </Root>
    );
};

CardActions.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
};

const PREFIX = 'RaCardActions';

export const CardActionsClasses = {
    cardActions: `${PREFIX}-cardActions`,
};

const Root = styled('div', { name: PREFIX })({
    [`&.${CardActionsClasses.cardActions}`]: {
        zIndex: 2,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        padding: 0,
    },
});
