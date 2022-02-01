import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CardContent from '@mui/material/CardContent';

/**
 * Overrides material-ui CardContent to allow inner content
 *
 * When using several CardContent inside the same Card, the top and bottom
 * padding double the spacing between each CardContent, leading to too much
 * wasted space. Use this component as a CardContent alternative.
 */
export const CardContentInner = (props: CardContentInnerProps): JSX.Element => {
    const { className, children } = props;

    return (
        <Root className={classnames(CardContentInnerClasses.root, className)}>
            {children}
        </Root>
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

const PREFIX = 'RaCardContentInner';

export const CardContentInnerClasses = {
    root: `${PREFIX}-root`,
};

const Root = styled(CardContent, {
    name: PREFIX,
    overridesResolver: (props, styles) => [styles.root],
})(({ theme }) => ({
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
}));
