import React from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import { withStyles } from '@material-ui/core/styles';
import { FieldTitle } from 'ra-core';

const styles = theme => ({
    label: {
        position: 'relative',
    },
    value: {
        fontFamily: theme.typography.fontFamily,
        color: 'currentColor',
        padding: `${theme.spacing.unit}px 0 ${theme.spacing.unit / 2}px`,
        border: 0,
        boxSizing: 'content-box',
        verticalAlign: 'middle',
        background: 'none',
        margin: 0, // Reset for Safari
        display: 'block',
        width: '100%',
    },
});

/**
 * Use any component as read-only Input, labeled just like other Inputs.
 *
 * Useful to use a Field in the Edit or Create components.
 * The child component will receive the current record.
 *
 * This component name doesn't have a typo. We had to choose between
 * the American English "Labeled", and the British English "Labelled".
 * We flipped a coin.
 *
 * @example
 * <Labeled label="Comments">
 *     <FooComponent source="title" />
 * </Labeled>
 */
export const Labeled = ({
    children,
    classes,
    className,
    fullWidth,
    id,
    input,
    isRequired,
    label,
    meta,
    resource,
    source,
    ...rest
}) => {
    if (!label && !source) {
        throw new Error(
            `Cannot create label for component <${children &&
                children.type &&
                children.type
                    .name}>: You must set either the label or source props. You can also disable automated label insertion by setting 'addLabel: false' in the component default props`
        );
    }
    const restProps = fullWidth ? { ...rest, fullWidth } : rest;

    return (
        <FormControl
            className={className}
            margin="normal"
            fullWidth={fullWidth}
            error={meta && meta.touched && meta.error}
        >
            <InputLabel htmlFor={id} shrink className={classes.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>
            <div className={classes.value}>
                {children && typeof children.type !== 'string'
                    ? React.cloneElement(children, {
                          input,
                          resource,
                          ...restProps,
                      })
                    : children}
            </div>
        </FormControl>
    );
};

Labeled.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    labelStyle: PropTypes.object,
};

export default withStyles(styles)(Labeled);
