import * as React from 'react';
import { FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import { useInput, FieldTitle, InputProps } from 'ra-core';
import { TextFieldProps } from '@material-ui/core/TextField';
import { Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import ResettableTextField from './ResettableTextField';
import InputHelperText from './InputHelperText';
import sanitizeInputRestProps from './sanitizeInputRestProps';

export type TextInputProps = InputProps<TextFieldProps> &
    Omit<TextFieldProps, 'label' | 'helperText'>;

/**
 * An Input component for a string
 *
 * @example
 * <TextInput source="first_name" />
 *
 * You can customize the `type` props (which defaults to "text").
 * Note that, due to a React bug, you should use `<NumberField>` instead of using type="number".
 * @example
 * <TextInput source="email" type="email" />
 * <NumberInput source="nb_views" />
 *
 * The object passed as `options` props is passed to the <ResettableTextField> component
 */

const TextInput: FunctionComponent<TextInputProps> = props => {
    const {
        label,
        format,
        helperText,
        onBlur,
        onFocus,
        onChange,
        options,
        parse,
        resource,
        source,
        validate,
        ...rest
    } = props;
    const classes = useStyles(props);

    const {
        id,
        input,
        isRequired,
        meta: { error, submitError, touched },
    } = useInput({
        format,
        onBlur,
        onChange,
        onFocus,
        parse,
        resource,
        source,
        type: 'text',
        validate,
        ...rest,
    });

    return (
        <div className={classes.root}>
            <ResettableTextField
                id={id}
                {...input}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                error={!!(touched && (error || submitError))}
                helperText={
                    <InputHelperText
                        touched={touched}
                        error={error || submitError}
                        helperText={helperText}
                    />
                }
                {...options}
                {...sanitizeInputRestProps(rest)}
            />
        </div>
    );
};

/*
 * The left top border is weird when variant  property is outlined.
 * Following styles fix it temporarily.
 * > https://github.com/marmelab/react-admin/issues/6468
 */
const useStyles = makeStyles<Theme, TextInputProps>(
    {
        root: {
            '& .MuiOutlinedInput-notchedOutline': {
                '& legend': {
                    width: ({ label }) =>
                        label === false || label === '' ? '0.01px' : 'auto',
                },
            },
        },
    },

    { name: 'RaTextInput' }
);

TextInput.propTypes = {
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

TextInput.defaultProps = {
    options: {},
};

export default TextInput;
