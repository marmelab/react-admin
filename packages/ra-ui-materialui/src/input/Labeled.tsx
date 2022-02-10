import * as React from 'react';
import { styled } from '@mui/material/styles';
import { ReactElement } from 'react';
import PropTypes from 'prop-types';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { FieldTitle, useResourceContext } from 'ra-core';

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
        isRequired,
        label,
        labelId,
        margin = 'dense',
        fieldState,
        source,
    } = props;

    const resource = useResourceContext(props);

    if (!label && !source) {
        // @ts-ignore
        const name = children && children.type && children.type.name;

        throw new Error(
            `Cannot create label for component <${name}>: You must set either the label or source props. You can also disable automated label insertion by setting 'label: false' in the component props`
        );
    }
    return (
        <StyledFormControl
            className={className}
            fullWidth={fullWidth}
            error={fieldState && fieldState.isTouched && !!fieldState.error}
            margin={margin}
        >
            {label === false ? null : (
                <InputLabel
                    id={labelId}
                    htmlFor={id}
                    shrink
                    className={LabeledClasses.label}
                >
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                </InputLabel>
            )}
            <div className={LabeledClasses.value}>{children}</div>
        </StyledFormControl>
    );
};

Labeled.displayName = 'Labeled';

Labeled.propTypes = {
    children: PropTypes.element,
    className: PropTypes.string,
    field: PropTypes.object,
    fieldState: PropTypes.object,
    fullWidth: PropTypes.bool,
    id: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    onChange: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    labelStyle: PropTypes.object,
};

export interface LabeledProps {
    children: ReactElement;
    className?: string;
    field?: any;
    fieldState?: any;
    fullWidth?: boolean;
    id?: string;
    isRequired?: boolean;
    label?: string | ReactElement | false;
    labelId?: string;
    resource?: string;
    source?: string;
    [key: string]: any;
}

const PREFIX = 'RaLabeled';

export const LabeledClasses = {
    label: `${PREFIX}-label`,
    value: `${PREFIX}-value`,
};

const StyledFormControl = styled(FormControl, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${LabeledClasses.label}`]: {
        position: 'relative',
        marginLeft: -14,
        maxWidth: 'fit-content',
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
        marginTop: -12,
        display: 'block',
        width: '100%',
    },
}));
