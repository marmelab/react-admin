import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChipInput from 'material-ui-chip-input';

import translate from '../../i18n/translate';
import FieldTitle from '../../util/FieldTitle';

import MenuItem from 'material-ui/MenuItem';
import AddIcon from 'material-ui/svg-icons/content/add-circle';
import { cyan500 } from 'material-ui/styles/colors';

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
            values: this.getChoicesForValues(this.props.input.value || [], this.props.choices),
            currentValue: '',
        });
    }

    componentWillReceiveProps = (nextProps) => {
        if (
            this.props.choices !== nextProps.choices ||
            this.props.input.value !== nextProps.input.value
        ) {
            this.setState({
                values: this.getChoicesForValues(nextProps.input.value || [], nextProps.choices),
            });
        }
    };

    existsInChoices(obj) {
        const { optionText } = this.props;
        const text = typeof obj === 'string' ? obj : obj.text;
        return this.props.choices.find(choice => choice[optionText] === text);
    };

    handleCreatedRecord = (createdRecord) => {
        const { optionText, optionValue } = this.props;
        const values = [...this.state.values, {
            text: createdRecord[optionText],
            value: createdRecord[optionValue],
        }];
        this.setState({ values });
        this.handleChange(values);

        setTimeout(() => {
            this.chipInput.focus();
        }, 50);
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

    handleAdd = (newValue) => {
        const { optionText, onCreateInline } = this.props;
        const exists = this.existsInChoices(newValue);

        if (onCreateInline && !exists) {
            setTimeout(() => {
                this.chipInput.autoComplete.blur();
            }, 50);

            onCreateInline({
                [optionText]: this.state.currentValue,
            }, this.handleCreatedRecord);

            this.handleUpdateInput('');
        } else if (exists) {
            const values = [...this.state.values, newValue];
            this.setState({ values });
            this.handleChange(values);
        }
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

    handleUpdateInput = (value) => {
        this.setState({
            currentValue: value,
        });

        return this.props.setFilter(value);
    };

    extractIds = (eventOrValue) => {
        const value = (eventOrValue.target && eventOrValue.target.value) ? eventOrValue.target.value : eventOrValue;
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
            .map(value => choices.find(c => c[optionValue] === value) || { [optionValue]: value, [optionText]: value })
            .map(this.formatChoice);
    };

    formatChoices = choices => choices.map(this.formatChoice);

    formatChoice = (choice) => {
        const { optionText, optionValue, translateChoice, translate } = this.props;
        const choiceText = typeof optionText === 'function' ? optionText(choice) : choice[optionText];
        return {
            value: choice[optionValue],
            text: translateChoice ? translate(choiceText, { _: choiceText }) : choiceText,
        };
    }

    renderCreateButton = () => (
        <MenuItem
            rightIcon={<AddIcon color={cyan500} />}
        >
            <span
                style={{
                    fontWeight: 'bold',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: 'block',
                }}
            >
                Create: {this.state.currentValue}
            </span>
        </MenuItem>
    );

    getChoices = () => {
        const exists = this.existsInChoices(this.state.currentValue);
        const showCreateButton = this.props.onCreateInline && !exists && this.state.currentValue.trim().length > 0;
        let choices = this.formatChoices(this.props.choices);

        if (showCreateButton) {
            choices = [
                {
                    text: `${this.state.currentValue}_CREATE_`,
                    value: this.renderCreateButton(),
                },
                ...choices,
            ];
        }

        return choices;
    }

    render() {
        const {
                elStyle,
            input,
            isRequired,
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
                ref={(ref) => { this.chipInput = ref; }}
                value={this.state.values}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onTouchTap={this.handleFocus}
                onRequestAdd={this.handleAdd}
                onRequestDelete={this.handleDelete}
                onUpdateInput={this.handleUpdateInput}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
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
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    name: PropTypes.string,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    onCreateInline: PropTypes.func,
    setFilter: PropTypes.func,
    options: PropTypes.object,
    optionText: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.func,
    ]).isRequired,
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
