import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { FieldTitle } from 'ra-core';

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
export const Labeled = (props: LabeledProps) => {
    const {
        children,
        className,
        fullWidth,
        id,
        input,
        isRequired,
        label,
        margin = 'dense',
        meta,
        resource,
        source,
        ...rest
    } = props;

    if (!label && !source) {
        // @ts-ignore
        const name = children && children.type && children.type.name;

        throw new Error(
            `Cannot create label for component <${name}>: You must set either the label or source props. You can also disable automated label insertion by setting 'addLabel: false' in the component default props`
        );
    }
    const restProps = fullWidth ? { ...rest, fullWidth } : rest;

    return (
        <StyledFormControl
            className={className}
            fullWidth={fullWidth}
            error={meta && meta.touched && !!(meta.error || meta.submitError)}
            margin={margin}
        >
            <InputLabel htmlFor={id} shrink className={LabeledClasses.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </InputLabel>
            <div className={LabeledClasses.value}>
                {children && typeof children.type !== 'string'
                    ? React.cloneElement(children, {
                          input,
                          resource,
                          ...restProps,
                      })
                    : children}
            </div>
        </StyledFormControl>
    );
};

Labeled.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    meta: PropTypes.object,
    onChange: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    labelStyle: PropTypes.object,
};

export interface LabeledProps {
    children: ReactElement;
    className?: string;
    fullWidth?: boolean;
    id?: string;
    input?: any;
    isRequired?: boolean;
    label?: string | ReactElement;
    meta?: any;
    resource?: string;
    source?: string;
    [key: string]: any;
}

const PREFIX = 'RaLabeled';

export const LabeledClasses = {
    label: `${PREFIX}-label`,
    value: `${PREFIX}-value`,
};

const StyledFormControl = styled(FormControl, { name: PREFIX })(
    ({ theme }) => ({
        [`& .${LabeledClasses.label}`]: {
            position: 'relative',
        },

        [`& .${LabeledClasses.value}`]: {
            fontFamily: theme.typography.fontFamily,
            color: 'currentColor',
            padding: `calc(${theme.spacing(1)} 0 ${theme.spacing(1)} / 2)`,
            border: 0,
            boxSizing: 'content-box',
            verticalAlign: 'middle',
            background: 'none',
            margin: 0, // Reset for Safari
            display: 'block',
            width: '100%',
        },
    })
);
