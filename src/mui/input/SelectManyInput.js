import React, { Component, PropTypes } from 'react';
import ChipInput from 'material-ui-chip-input';
import FieldTitle from '../../util/FieldTitle';

/**
 * An Input component for an array
 *
 * @example
 * <SelectManyInput source="categories" />
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
 * <SelectManyInput source="categories" choices={choices} />
 *
 * You can also customize the properties to use for the option name and value,
 * thanks to the 'optionText' and 'optionValue' attributes.
 * @example
 * const choices = [
 *    { _id: '1', name: 'Book', plural_name: 'Books' },
 *    { _id: '2', name: 'Video', plural_name: 'Videos' },
 *    { _id: '3', name: 'Audio', plural_name: 'Audios' },
 * ];
 * <SelectManyInput source="categories" choices={choices} optionText="plural_name" optionValue="_id" />
 *
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */
export class SelectManyInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            values: this.resolveValues(props.input.value || []),
        };
    }

    handleBlur = () => {
        var extracted = this.extractIds(this.state.values);
        this.props.onBlur(extracted);
        this.props.input.onBlur(extracted);
    };

    handleFocus = () => {
        var extracted = this.extractIds(this.state.values);
        this.props.onFocus(extracted);
        this.props.input.onFocus(extracted);
    };

    handleAdd = (newValue) => {
        this.setState({ values: [ ...this.state.values, newValue ] });
        this.handleChange(this.state.values);
    };

    handleDelete = (newValue) => {
        this.setState({ values: this.state.values.filter(v => (v[ this.props.optionValue ] !== newValue)) });
        this.handleChange(this.state.values);
    };

    handleChange = (eventOrValue) => {
        var extracted = this.extractIds(eventOrValue);
        this.props.onChange(extracted);
        this.props.input.onChange(extracted);
    };

    extractIds = (eventOrValue) => {
        const value = (eventOrValue.target && eventOrValue.target.value) ? eventOrValue.target.value : eventOrValue;
        if (Array.isArray(value)) {
            return value.map((o) => o[ this.props.optionValue ])
        }
        return [ value ];
    };

    resolveValues = (values) => {
        if (!values || !Array.isArray(values)) {
            throw Error("Value of SelectManyInput should be an array");
        }

        if (this.props.choices && this.props.choices.length > 0) {
            return this.props.choices.filter((o) => values.indexOf(o[ this.props.optionValue ]) >= 0);
        }
        return values.map((v) => ({
            [this.props.optionValue]: v,
            [this.props.optionText]: v,
        }));
    };

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
        } = this.props;

        return (
            <ChipInput
                {...input}
                value={this.state.values}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onTouchTap={this.handleFocus}
                onRequestDelete={this.handleDelete}
                onRequestAdd={this.handleAdd}
                onUpdateInput={setFilter}
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource}/>}
                errorText={touched && error}
                style={elStyle}
                dataSource={choices}
                dataSourceConfig={{ 'text': optionText, 'value': optionValue }}
                {...options}
            />
        );
    }
}

SelectManyInput.propTypes = {
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
    validation: PropTypes.object,
};

SelectManyInput.defaultProps = {
    addField: true,
    choices: [],
    onBlur: () => true,
    onChange: () => true,
    onFocus: () => true,
    options: {},
    optionText: 'name',
    optionValue: 'id',
};

export default SelectManyInput;
