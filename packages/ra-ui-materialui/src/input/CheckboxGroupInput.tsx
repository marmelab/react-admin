import React, { FunctionComponent, useCallback, ReactElement } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import { useField, useTranslate, FieldTitle } from 'ra-core';

import defaultSanitizeRestProps from './sanitizeRestProps';
import { InputProps } from './types';
import InputHelperText from './InputHelperText';
const sanitizeRestProps = ({
    setFilter,
    setPagination,
    setSort,
    ...rest
}: any) => defaultSanitizeRestProps(rest);

const useStyles = makeStyles(theme => ({
    root: {},
    label: {
        transform: 'translate(0, 1.5px) scale(0.75)',
        transformOrigin: `top ${theme.direction === 'ltr' ? 'left' : 'right'}`,
    },
    checkbox: {
        height: 32,
    },
}));

type OptionTextFunc = (choice: any) => string;
interface Props {
    choices: any[];
    optionText?: string | OptionTextFunc | ReactElement<{ record: any }>;
    optionValue?: string;
    translateChoice?: boolean;
}

/**
 * An Input component for a checkbox group, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * The expected input must be an array of identifiers (e.g. [12, 31]) which correspond to
 * the 'optionValue' of 'choices' attribute objects.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *     { id: 12, name: 'Ray Hakt' },
 *     { id: 31, name: 'Ann Gullar' },
 *     { id: 42, name: 'Sean Phonee' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi' },
 *    { _id: 456, full_name: 'Jane Austen' },
 * ];
 * <CheckboxGroupInput source="recipients" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <CheckboxGroupInput source="recipients" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'programming', name: 'myroot.category.programming' },
 *    { id: 'lifestyle', name: 'myroot.category.lifestyle' },
 *    { id: 'photography', name: 'myroot.category.photography' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <CheckboxGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <Checkbox> components
 */
const CheckboxGroupInput: FunctionComponent<Props & InputProps> = ({
    choices,
    className,
    helperText,
    label,
    resource,
    source,
    id,
    optionText,
    optionValue,
    options,
    translateChoice,
    validate,
    ...rest
}) => {
    const classes = useStyles({});
    const translate = useTranslate();
    const {
        input: { value, onChange, onBlur },
        isRequired,
        meta,
    } = useField({ source, validate, ...rest });

    const handleCheck = useCallback(
        (event, isChecked) => {
            let newValue;
            try {
                // try to convert string value to number, e.g. '123'
                newValue = JSON.parse(event.target.value);
            } catch (e) {
                // impossible to convert value, e.g. 'abc'
                newValue = event.target.value;
            }

            let values;
            if (isChecked) {
                values = [...(value || []), ...[newValue]];
            } else {
                values = value.filter(v => v != newValue); // eslint-disable-line eqeqeq
            }
            onChange(values);
            onBlur(values); // HACK: See https://github.com/final-form/react-final-form/issues/365#issuecomment-515045503
        },
        [onBlur, onChange, value]
    );

    const renderCheckbox = choice => {
        const choiceName = React.isValidElement(optionText)
            ? React.cloneElement(optionText, { record: choice })
            : typeof optionText === 'function'
            ? optionText(choice)
            : get(choice, optionText);

        return (
            <FormControlLabel
                htmlFor={`${id}_${get(choice, optionValue)}`}
                key={get(choice, optionValue)}
                checked={
                    value
                        ? value.find(v => v == get(choice, optionValue)) !== // eslint-disable-line eqeqeq
                          undefined
                        : false
                }
                onChange={handleCheck}
                value={String(get(choice, optionValue))}
                control={
                    <Checkbox
                        id={`${id}_${get(choice, optionValue)}`}
                        color="primary"
                        className={classes.checkbox}
                        {...options}
                    />
                }
                label={
                    translateChoice
                        ? translate(choiceName, { _: choiceName })
                        : choiceName
                }
            />
        );
    };

    if (typeof meta === 'undefined') {
        throw new Error(
            "The CheckboxGroupInput component wasn't called within a react-final-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
        );
    }

    const { touched, error } = meta;

    return (
        <FormControl
            className={className}
            component="fieldset"
            margin="normal"
            {...sanitizeRestProps(rest)}
        >
            <FormLabel component="legend" className={classes.label}>
                <FieldTitle
                    label={label}
                    source={source}
                    resource={resource}
                    isRequired={isRequired}
                />
            </FormLabel>
            <FormGroup row>{choices.map(renderCheckbox)}</FormGroup>
            {helperText || (touched && !!error) ? (
                <FormHelperText error={!!error}>
                    <InputHelperText
                        touched={touched}
                        error={error}
                        helperText={helperText}
                    />
                </FormHelperText>
            ) : null}
        </FormControl>
    );
};

CheckboxGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    label: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
    id: PropTypes.string,
    isRequired: PropTypes.bool,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    translateChoice: PropTypes.bool.isRequired,
    meta: PropTypes.object,
};

CheckboxGroupInput.defaultProps = {
    choices: [],
    classes: {},
    fullWidth: true,
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default CheckboxGroupInput;
