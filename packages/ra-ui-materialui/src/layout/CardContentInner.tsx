import * as React from 'react';
import { ReactNode } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import CardContent from '@material-ui/core/CardContent';
import { makeStyles } from '@material-ui/core/styles';

import { ClassesOverride } from '../types';

const useStyles = makeStyles(
    theme => ({
        root: {
            paddingTop: 0,
            paddingBottom: 0,
            '&:first-child': {
                paddingTop: 16,
            },
            '&:last-child': {
                paddingBottom: 16,
                [theme.breakpoints.only('xs')]: {
                    paddingBottom: 70,
                },
            },
        },
    }),
    { name: 'RaCardContentInner' }
);

/**
 * Overrides material-ui CardContent to allow inner content
 *
 * When using several CardContent inside the same Card, the top and bottom
 * padding double the spacing between each CardContent, leading to too much
 * wasted space. Use this component as a CardContent alternative.
 */
const CardContentInner = (props: CardContentInnerProps): JSX.Element => {
    const { className, children } = props;
    const classes = useStyles(props);
    return (
        <CardContent className={classnames(classes.root, className)}>
            {children}
        </CardContent>
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
    classes?: ClassesOverride<typeof useStyles>;
}

export default CardContentInner;
