import React, { Component, PropTypes } from 'react';
import ChipInput from 'material-ui-chip-input';
import FieldTitle from '../../util/FieldTitle';

/**
 * An Input component for a array
 *
 * @example
 * <ArrayInput source="first_name" />
 *
 * The object passed as `options` props is passed to the material-ui-chip-input component
 * @see https://github.com/TeamWertarbyte/material-ui-chip-input
 */
export class ArrayInput extends Component {
  // Comment input onBlur because ArrayInput don't pass correct values on this event
  handleBlur = (eventOrValue) => {
    this.props.onBlur(eventOrValue);
    // this.props.input.onBlur(eventOrValue);
  };
  // Comment input onFocus because ArrayInput don't pass correct values on this event
  handleFocus = (event) => {
    this.props.onFocus(event);
    // this.props.input.onFocus(event);
  };

  handleChange = (eventOrValue) => {
    this.props.onChange(eventOrValue);
    this.props.input.onChange(eventOrValue);
  };

  render() {
    const {
      elStyle,
      input,
      label,
      meta: { touched, error },
      options,
      resource,
      source,
    } = this.props;

    const defaultValue = input.value;
    delete input.value;

    return (
      <ChipInput
        {...input}
        defaultValue={defaultValue}
        onBlur={this.handleBlur}
        onFocus={this.handleFocus}
        onTouchTap={this.handleFocus}
        onChange={this.handleChange}
        floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
        errorText={touched && error}
        style={elStyle}
        {...options}
      />
    );
  }
}

ArrayInput.propTypes = {
  addField: PropTypes.bool.isRequired,
  elStyle: PropTypes.object,
  input: PropTypes.object,
  label: PropTypes.string,
  meta: PropTypes.object,
  name: PropTypes.string,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.object,
  resource: PropTypes.string,
  source: PropTypes.string,
  validation: PropTypes.object,
};

ArrayInput.defaultProps = {
  addField: true,
  onBlur: () => {},
  onChange: () => {},
  onFocus: () => {},
  options: {},
  type: 'text',
};

export default ArrayInput;
