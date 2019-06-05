import React, { SFC } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import pure from 'recompose/pure';
import FalseIcon from '@material-ui/icons/Clear';
import TrueIcon from '@material-ui/icons/Done';
import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import { translate as withTranslate, TranslationContextProps } from 'ra-core';

import { FieldProps, InjectedFieldProps, fieldPropTypes } from './types';
import sanitizeRestProps from './sanitizeRestProps';

const styles = createStyles({
    label: {
        // Move the text out of the flow of the container.
        position: 'absolute',

        // Reduce its height and width to just one pixel.
        height: 1,
        width: 1,

        // Hide any overflowing elements or text.
        overflow: 'hidden',

        // Clip the box to zero pixels.
        clip: 'rect(0, 0, 0, 0)',

        // Text won't wrap to a second line.
        whiteSpace: 'nowrap',
    },
});

interface Props extends FieldProps {
    valueLabelTrue?: string;
    valueLabelFalse?: string;
}

interface EnhancedProps extends TranslationContextProps, WithStyles<typeof styles> {}

export const BooleanField: SFC<Props & InjectedFieldProps & EnhancedProps & TypographyProps> = ({
    className,
    classes,
    source,
    record = {},
    translate,
    valueLabelTrue,
    valueLabelFalse,
    ...rest
}) => {
    const value = get(record, source);
    let ariaLabel = value ? valueLabelTrue : valueLabelFalse;

    if (!ariaLabel) {
        ariaLabel = value === false ? 'ra.boolean.false' : 'ra.boolean.true';
    }

    if (value === false) {
        return (
            <Typography component="span" variant="body1" className={className} {...sanitizeRestProps(rest)}>
                <span className={classes.label}>{translate(ariaLabel, { _: ariaLabel })}</span>
                <FalseIcon data-testid="false" />
            </Typography>
        );
    }

    if (value === true) {
        return (
            <Typography component="span" variant="body1" className={className} {...sanitizeRestProps(rest)}>
                <span className={classes.label}>{translate(ariaLabel, { _: ariaLabel })}</span>
                <TrueIcon data-testid="true" />
            </Typography>
        );
    }

    return <Typography component="span" variant="body1" className={className} {...sanitizeRestProps(rest)} />;
};

const EnhancedBooleanField = compose<
    Props & InjectedFieldProps & EnhancedProps & TypographyProps,
    Props & TypographyProps
>(
    pure,
    withStyles(styles),
    withTranslate
)(BooleanField);

EnhancedBooleanField.defaultProps = {
    addLabel: true,
};

EnhancedBooleanField.propTypes = {
    ...Typography.propTypes,
    ...fieldPropTypes,
    valueLabelFalse: PropTypes.string,
    valueLabelTrue: PropTypes.string,
};
EnhancedBooleanField.displayName = 'EnhancedBooleanField';

export default EnhancedBooleanField;
