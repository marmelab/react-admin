import React, { Component } from 'react';
import PropTypes from 'prop-types';
import get from 'lodash.get';
import ChipInput from 'material-ui-chip-input';

import translate from '../../i18n/translate';
import FieldTitle from '../../util/FieldTitle';

const dataSourceConfig = { text: 'text', value: 'value' };

/**
 * An Input component for an array
 *
 * @example
 * <SelectArrayInput source="categories" />
 *
 * Pass possible options as an array of objects in the 'choices' attribute.
 *
 * By default, the options are built from:
 *  - the 'id' property as the option value,
 *  - the 'name' property an the option text
 * @example
 * const choices = [
 *    { id: '1', name: 'Book' },
 *    { id: '2', name: 'Video' },
 *    { id: '3', name: 'Audio' },
 * ];
 * <SelectArrayInput source="categories" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: '1', name: 'Book', plural_name: 'Books' },
 *    { _id: '2', name: 'Video', plural_name: 'Videos' },
 *    { _id: '3', name: 'Audio', plural_name: 'Audios' },
 * ];
 * <SelectArrayInput source="categories" choices={choices} optionText="plural_name" optionValue="_id" />
 *
 * `optionText` also accepts a function, so you can shape the option text at will:
 * @example
 * const choices = [
 *    { id: '1', name: 'Book', quantity: 23 },
 *    { id: '2', name: 'Video', quantity: 56 },
 *    { id: '3', name: 'Audio', quantity: 12 },
 * ];
 * const optionRenderer = choice => `${choice.name} (${choice.quantity})`;
 * <SelectArrayInput source="categories" choices={choices} optionText={optionRenderer} />
 *
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */
export class SelectArrayInput extends Component {
    state = {
        values: [],
    };

    componentWillMount = () => {
        this.setState({
            values: this.getChoicesForValues(
                this.props.input.value || [],
                this.props.choices
            ),
        });
    };

    componentWillReceiveProps = nextProps => {
        if (
            this.props.choices !== nextProps.choices ||
            this.props.input.value !== nextProps.input.value
        ) {
            this.setState({
                values: this.getChoicesForValues(
                    nextProps.input.value || [],
                    nextProps.choices
                ),
            });
        }
    };

    handleBlur = () => {
        const extracted = this.extractIds(this.state.values);
        this.props.onBlur(extracted);
        this.props.input.onBlur(extracted);
    };

    handleFocus = () => {
        const extracted = this.extractIds(this.state.values);
        this.props.onFocus(extracted);
        this.props.input.onFocus(extracted);
    };

    handleAdd = newValue => {
        const values = [...this.state.values, newValue];
        this.setState({ values });
        this.handleChange(values);
    };

    handleDelete = newValue => {
        const values = this.state.values.filter(v => v.value !== newValue);
        this.setState({ values });
        this.handleChange(values);
    };

    handleChange = eventOrValue => {
        const extracted = this.extractIds(eventOrValue);
        this.props.onChange(extracted);
        this.props.input.onChange(extracted);
    };

    extractIds = eventOrValue => {
        const value =
            eventOrValue.target && eventOrValue.target.value
                ? eventOrValue.target.value
                : eventOrValue;
        if (Array.isArray(value)) {
            return value.map(o => o.value);
        }
        return [value];
    };

    getChoicesForValues = (values, choices = []) => {
        const { optionValue, optionText } = this.props;
        if (!values || !Array.isArray(values)) {
            throw Error('Value of SelectArrayInput should be an array');
        }
        return values
            .map(
                value =>
                    choices.find(c => c[optionValue] === value) || {
                        [optionValue]: value,
                        [optionText]: value,
                    }
            )
            .map(this.formatChoice);
    };

    formatChoices = choices => choices.map(this.formatChoice);

    formatChoice = choice => {
        const {
            optionText,
            optionValue,
            translateChoice,
            translate,
        } = this.props;
        const choiceText =
            typeof optionText === 'function'
                ? optionText(choice)
                : get(choice, optionText);
        return {
            value: get(choice, optionValue),
            text: translateChoice
                ? translate(choiceText, { _: choiceText })
                : choiceText,
        };
    };

    render() {
        const {
            elStyle,
            input,
            isRequired,
            choices,
            label,
            meta,
            options,
            resource,
            source,
            setFilter,
        } = this.props;
        if (typeof meta === 'undefined') {
            throw new Error(
                "The SelectArrayInput component wasn't called within a redux-form <Field>. Did you decorate it and forget to add the addField prop to your component? See https://marmelab.com/admin-on-rest/Inputs.html#writing-your-own-input-component for details."
            );
        }
        const { touched, error } = meta;

        return (
            <ChipInput
                {...input}
                value={this.state.values}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onClick={this.handleFocus}
                onRequestAdd={this.handleAdd}
                onRequestDelete={this.handleDelete}
                onUpdateInput={setFilter}
                floatingLabelText={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                errorText={touched && error}
                style={elStyle}
                dataSource={this.formatChoices(choices)}
                dataSourceConfig={dataSourceConfig}
                openOnFocus
                {...options}
            />
        );
    }
}

SelectArrayInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    choices: PropTypes.arrayOf(PropTypes.object),
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    setFilter: PropTypes.func,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
        .isRequired,
    optionValue: PropTypes.string.isRequired,
    resource: PropTypes.string,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
    translateChoice: PropTypes.bool.isRequired,
};

SelectArrayInput.defaultProps = {
    addField: true,
    choices: [],
    onBlur: () => true,
    onChange: () => true,
    onFocus: () => true,
    options: {},
    optionText: 'name',
    optionValue: 'id',
    translateChoice: true,
};

export default translate(SelectArrayInput);
