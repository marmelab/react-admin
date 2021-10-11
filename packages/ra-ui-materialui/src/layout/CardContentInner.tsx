import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CardContent from '@mui/material/CardContent';

const PREFIX = 'RaCardContentInner';

const classes = {
    root: `${PREFIX}-root`,
};

const Root = styled(CardContent)(({ theme }) => ({
    [`&.${classes.root}`]: {
        paddingTop: 0,
        paddingBottom: 0,
        '&:first-of-type': {
            paddingTop: 16,
        },
        '&:last-child': {
            paddingBottom: 16,
            [theme.breakpoints.only('xs')]: {
                paddingBottom: 70,
            },
        },
    },
}));

/**
 * Overrides material-ui CardContent to allow inner content
 *
 * When using several CardContent inside the same Card, the top and bottom
 * padding double the spacing between each CardContent, leading to too much
 * wasted space. Use this component as a CardContent alternative.
 */
const CardContentInner = (props: CardContentInnerProps): JSX.Element => {
    const { className, children } = props;

    return (
        <Root className={classnames(classes.root, className)}>{children}</Root>
    );
};

CardContentInner.propTypes = {
    className: PropTypes.string,
    classes: PropTypes.object,
    children: PropTypes.node,
};

export interface CardContentInnerProps {
    className?: string;
    children: ReactNode;
}

export default CardContentInner;
