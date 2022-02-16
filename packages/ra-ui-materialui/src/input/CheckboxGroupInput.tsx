import * as React from 'react';
import { useCallback, FunctionComponent } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl, { FormControlProps } from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormHelperText from '@material-ui/core/FormHelperText';
import { makeStyles } from '@material-ui/core/styles';
import { CheckboxProps } from '@material-ui/core/Checkbox';
import { FieldTitle, useInput, ChoicesInputProps, warning } from 'ra-core';

import sanitizeInputRestProps from './sanitizeInputRestProps';
import CheckboxGroupInputItem from './CheckboxGroupInputItem';
import InputHelperText from './InputHelperText';
import classnames from 'classnames';
import Labeled from './Labeled';
import { LinearProgress } from '../layout';
import { ClassesOverride } from '../types';

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
 *  - the 'name' property as the option text
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
 * However, in some cases (e.g. inside a `<ReferenceArrayInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <CheckboxGroupInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <Checkbox> components
 */
const CheckboxGroupInput: FunctionComponent<CheckboxGroupInputProps> = props => {
    const {
        choices = [],
        className,
        classes: classesOverride,
        format,
        helperText,
        label,
        loaded,
        loading,
        margin = 'dense',
        onBlur,
        onChange,
        onFocus,
        optionText,
        optionValue,
        options,
        parse,
        resource,
        row,
        source,
        translate,
        translateChoice,
        validate,
        ...rest
    } = props;
    const classes = useStyles(props);

    warning(
        source === undefined,
        `If you're not wrapping the CheckboxGroupInput inside a ReferenceArrayInput, you must provide the source prop`
    );

    warning(
        choices === undefined,
        `If you're not wrapping the CheckboxGroupInput inside a ReferenceArrayInput, you must provide the choices prop`
    );

    const {
        id,
        input: { onChange: finalFormOnChange, onBlur: finalFormOnBlur, value },
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
        validate,
        ...rest,
    });

    const handleCheck = useCallback(
        (event, isChecked) => {
            let newValue;

            if (
                choices.every(
                    item => typeof get(item, optionValue) === 'number'
                )
            ) {
                try {
                    // try to convert string value to number, e.g. '123'
                    newValue = JSON.parse(event.target.value);
                } catch (e) {
                    // impossible to convert value, e.g. 'abc'
                    newValue = event.target.value;
                }
            } else {
                newValue = event.target.value;
            }

            if (isChecked) {
                finalFormOnChange([...(value || []), ...[newValue]]);
            } else {
                finalFormOnChange(value.filter(v => v != newValue)); // eslint-disable-line eqeqeq
            }
            finalFormOnBlur(); // HACK: See https://github.com/final-form/react-final-form/issues/365#issuecomment-515045503
        },
        [choices, finalFormOnBlur, optionValue, finalFormOnChange, value]
    );

    if (loading) {
        return (
            <Labeled
                label={label}
                source={source}
                resource={resource}
                className={className}
                isRequired={isRequired}
                margin={margin}
            >
                <LinearProgress />
            </Labeled>
        );
    }

    return (
        <FormControl
            component="fieldset"
            margin={margin}
            error={touched && !!(error || submitError)}
            className={classnames(classes.root, className)}
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
            <FormGroup row={row}>
                {choices.map(choice => (
                    <CheckboxGroupInputItem
                        key={get(choice, optionValue)}
                        choice={choice}
                        id={id}
                        onChange={handleCheck}
                        options={options}
                        optionText={optionText}
                        optionValue={optionValue}
                        translateChoice={translateChoice}
                        value={value}
                    />
                ))}
            </FormGroup>
            <FormHelperText>
                <InputHelperText
                    touched={touched}
                    error={error || submitError}
                    helperText={helperText}
                />
            </FormHelperText>
        </FormControl>
    );
};

const sanitizeRestProps = ({
    refetch,
    setFilter,
    setPagination,
    setSort,
    loaded,
    touched,
    ...rest
}: any) => sanitizeInputRestProps(rest);

const useStyles = makeStyles(
    theme => ({
        root: {},
        label: {
            transform: 'translate(0, 8px) scale(0.75)',
            transformOrigin: `top ${
                theme.direction === 'ltr' ? 'left' : 'right'
            }`,
        },
    }),
    { name: 'RaCheckboxGroupInput' }
);

CheckboxGroupInput.propTypes = {
    choices: PropTypes.arrayOf(PropTypes.object),
    className: PropTypes.string,
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    source: PropTypes.string,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]),
    optionValue: PropTypes.string,
    row: PropTypes.bool,
    resource: PropTypes.string,
    translateChoice: PropTypes.bool,
};

CheckboxGroupInput.defaultProps = {
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
    fullWidth: true,
    row: true,
};

export interface CheckboxGroupInputProps
    extends ChoicesInputProps<CheckboxProps>,
        FormControlProps {
    classes?: ClassesOverride<typeof useStyles>;
}

export default CheckboxGroupInput;
