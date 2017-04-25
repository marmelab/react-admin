import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */
export class SelectArrayInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            values: this.resolveValues(props.input.value || []),
        };
    }

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

    handleAdd = (newValue) => {
        const values = [...this.state.values, newValue];
        this.setState({ values });
        this.handleChange(values);
    };

    handleDelete = (newValue) => {
        const values = this.state.values.filter(v => (v.value !== newValue));
        this.setState({ values });
        this.handleChange(values);
    };

    handleChange = (eventOrValue) => {
        const extracted = this.extractIds(eventOrValue);
        this.props.onChange(extracted);
        this.props.input.onChange(extracted);
    };

    extractIds = (eventOrValue) => {
        const value = (eventOrValue.target && eventOrValue.target.value) ? eventOrValue.target.value : eventOrValue;
        if (Array.isArray(value)) {
            return value.map(o => o.value);
        }
        return [value];
    };

    resolveValues = (values) => {
        if (!values || !Array.isArray(values)) {
            throw Error('Value of SelectArrayInput should be an array');
        }

        if (this.props.choices && this.props.choices.length > 0) {
            return this.getChoices().filter(choice => values.includes(choice.value));
        }
        return [];
    };

    getChoices = () => {
        const {
            choices,
            optionText,
            optionValue,
            translate,
            translateChoice,
        } = this.props;
        return choices.map(choice => ({
            value: choice[optionValue],
            text: translateChoice ? translate(choice[optionText], { _: choice[optionText] }) : choice[optionText],
        }));
    }

    render() {
        const {
            elStyle,
            input,
            choices,
            label,
            meta: { touched, error },
            options,
            optionText,
            optionValue,
            resource,
            source,
            setFilter,
            translate,
            translateChoice,
        } = this.props;

        return (
            <ChipInput
                {...input}
                value={this.state.values}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onTouchTap={this.handleFocus}
                onRequestAdd={this.handleAdd}
                onRequestDelete={this.handleDelete}
                onUpdateInput={setFilter}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource}/>}
                errorText={touched && error}
                style={elStyle}
                dataSource={this.getChoices()}
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
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    setFilter: PropTypes.func,
    options: PropTypes.object,
    optionText: PropTypes.string.isRequired,
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
