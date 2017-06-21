import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TimePicker from 'material-ui/TimePicker';
import FieldTitle from '../../util/FieldTitle';

export const datify = input => {

  if (!input) {
    return null;
  }

  /* If input does not start with YYYY-MM-DD,
     prepend the current date and parse as date
     using the local timezone. */
  const date = (input instanceof Date) ?
    input :
    (!input.match(/^\d{4}-\d{2}-\d{2}/)) ?
      new Date(new Date().toISOString().substring(0, 10) + 'T' + input) :
      new Date(input)

    if (isNaN(date)) {
      throw new Error(`Invalid date: ${input}`);
    }

    return date;

}


class TimeInput extends Component {
    onChange = (_, date) => {
        this.props.input.onChange(date);
        this.props.input.onBlur();
    };

    /**
     * This aims to fix a bug created by the conjunction of
     * redux-form, which expects onBlur to be triggered after onChange, and
     * material-ui, which triggers onBlur on <TimePicker> when the user clicks
     * on the input to bring the focus on the calendar rather than the input.
     *
     * @see https://github.com/erikras/redux-form/issues/1218#issuecomment-229072652
     */
    onBlur = () => {};

    onDismiss = () => this.props.input.onBlur();

    render() {
        const { input, isRequired, label, meta: { touched, error }, options, source, elStyle, resource } = this.props;

        // input.value = new Date;

        return (<TimePicker
            {...input}
            errorText={touched && error}
            floatingLabelText={<FieldTitle label={label} source={source} resource={resource} isRequired={isRequired} />}
            autoOk
            value={datify(input.value)}
            onChange={this.onChange}
            onBlur={this.onBlur}
            onDismiss={this.onDismiss}
            style={elStyle}
            {...options}
        />);
    }
}

TimeInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    elStyle: PropTypes.object,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
};

TimeInput.defaultProps = {
    addField: true,
    options: {},
};

export default TimeInput;
