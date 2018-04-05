import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import TextField from 'material-ui/TextField';
import { MenuItem } from 'material-ui/Menu';
import { withStyles } from 'material-ui/styles';
import compose from 'recompose/compose';
import { addField, translate, FieldTitle } from 'ra-core';

const sanitizeRestProps = ({
    addLabel,
    allowEmpty,
    basePath,
    choices,
    className,
    component,
    crudGetMatching,
    crudGetOne,
    defaultValue,
    filter,
    filterToQuery,
    formClassName,
    initializeForm,
    input,
    isRequired,
    label,
    locale,
    meta,
    onChange,
    options,
    optionValue,
    optionText,
    perPage,
    record,
    reference,
    resource,
    setFilter,
    setPagination,
    setSort,
    sort,
    source,
    textAlign,
    translate,
    translateChoice,
    validation,
    ...rest
}) => rest;

const styles = theme => ({
    input: {
        minWidth: theme.spacing.unit * 20,
    },
});

/**
 * An Input component for a select box, using an array of objects for the options
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: 'M', name: 'Male' },
 *    { id: 'F', name: 'Female' },
 * ];
 * <SelectInput source="gender" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: 123, full_name: 'Leo Tolstoi', sex: 'M' },
 *    { _id: 456, full_name: 'Jane Austen', sex: 'F' },
 * ];
 * <SelectInput source="author_id" choices={choices} optionText="full_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const optionRenderer = choice => `${choice.first_name} ${choice.last_name}`;
 * <SelectInput source="author_id" choices={choices} optionText={optionRenderer} />
 *
 * `optionText` also accepts a React Element, that will be cloned and receive
 * the related choice as the `record` prop. You can use Field components there.
 * @example
 * const choices = [
 *    { id: 123, first_name: 'Leo', last_name: 'Tolstoi' },
 *    { id: 456, first_name: 'Jane', last_name: 'Austen' },
 * ];
 * const FullNameField = ({ record }) => <span>{record.first_name} {record.last_name}</span>;
 * <SelectInput source="gender" choices={choices} optionText={<FullNameField />}/>
 *
 * The choices are translated by default, so you can use translation identifiers as choices:
 * @example
 * const choices = [
 *    { id: 'M', name: 'myroot.gender.male' },
 *    { id: 'F', name: 'myroot.gender.female' },
 * ];
 *
 * However, in some cases (e.g. inside a `<ReferenceInput>`), you may not want
 * the choice to be translated. In that case, set the `translateChoice` prop to false.
 * @example
 * <SelectInput source="gender" choices={choices} translateChoice={false}/>
 *
 * The object passed as `options` props is passed to the material-ui <Select> component
 */
export class SelectInput extends Component {
    /*
     * Using state to bypass a redux-form comparison but which prevents re-rendering
     * @see https://github.com/erikras/redux-form/issues/2456
     */
    state = {
        value: this.props.input.value,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.input.value !== this.props.input.value) {
            this.setState({ value: nextProps.input.value });
        }
    }

    handleChange = event => {
        this.props.input.onChange(event.target.value);
        this.setState({ value: event.target.value });
    };

    addAllowEmpty = choices => {
        if (this.props.allowEmpty) {
            return [<MenuItem value={null} key="null" />, ...choices];
        }

        return choices;
    };
    renderMenuItemOption = choice => {
        const { optionText, translate, translateChoice } = this.props;
        if (React.isValidElement(optionText))
            return React.cloneElement(optionText, {
                record: choice,
            });
        const choiceName =
            typeof optionText === 'function'
                ? optionText(choice)
                : get(choice, optionText);
        return translateChoice
            ? translate(choiceName, { _: choiceName })
            : choiceName;
    };

    renderMenuItem = choice => {
        const { optionValue } = this.props;
        return (
            <MenuItem
                key={get(choice, optionValue)}
                value={get(choice, optionValue)}
            >
                {this.renderMenuItemOption(choice)}
            </MenuItem>
        );
    };

    render() {
        const {
            choices,
            classes,
            className,
            isRequired,
            label,
            meta,
            options,
            resource,
            source,
            allowEmpty,
            ...rest
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The SelectInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/react-admin/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error, helperText = false } = meta;

        return (
            <TextField
                select
                margin="normal"
                value={this.state.value}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                className={`${classes.input} ${className}`}
                error={!!(touched && error)}
                helperText={(touched && error) || helperText}
                {...options}
                {...sanitizeRestProps(rest)}
                onChange={this.handleChange}
            >
                {this.addAllowEmpty(choices.map(this.renderMenuItem))}
            </TextField>
        );
    }
}

SelectInput.propTypes = {
    allowEmpty: PropTypes.bool.isRequired,
    choices: PropTypes.arrayOf(PropTypes.object),
    classes: PropTypes.object,
    className: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
        PropTypes.element,
    ]).isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool,
};

SelectInput.defaultProps = {
    allowEmpty: false,
    classes: {},
    choices: [],
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default compose(addField, translate, withStyles(styles))(SelectInput);
