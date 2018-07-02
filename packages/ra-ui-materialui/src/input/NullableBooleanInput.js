import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import { withStyles } from '@material-ui/core/styles';
import compose from 'recompose/compose';
import classnames from 'classnames';
import { addField, translate, FieldTitle } from 'ra-core';

import sanitizeRestProps from './sanitizeRestProps';

const styles = theme => ({
    input: { width: theme.spacing.unit * 16 },
});

export class NullableBooleanInput extends Component {
    state = {
        value: this.props.input.value,
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps.input.value !== this.props.input.value) {
            this.setState({ value: nextProps.input.value });
        }
    }

    handleChange = event => {
        this.props.input.onChange(
            this.getBooleanFromString(event.target.value)
        );
        this.setState({ value: event.target.value });
    };

    getBooleanFromString = value => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return null;
    };

    getStringFromBoolean = value => {
        if (value === true) return 'true';
        if (value === false) return 'false';
        return '';
    };

    render() {
        const {
            classes,
            className,
            isRequired,
            label,
            meta,
            options,
            resource,
            source,
            translate,
            ...rest
        } = this.props;
        const { touched, error } = meta;
        return (
            <TextField
                select
                margin="normal"
                value={this.getStringFromBoolean(this.state.value)}
                label={
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired}
                    />
                }
                error={!!(touched && error)}
                helperText={touched && error}
                className={classnames(classes.input, className)}
                {...options}
                {...sanitizeRestProps(rest)}
                onChange={this.handleChange}
            >
                <MenuItem value="" />
                <MenuItem value="false">
                    {translate('ra.boolean.false')}
                </MenuItem>
                <MenuItem value="true">{translate('ra.boolean.true')}</MenuItem>
            </TextField>
        );
    }
}

NullableBooleanInput.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    input: PropTypes.object,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    meta: PropTypes.object,
    options: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    translate: PropTypes.func.isRequired,
};

const enhance = compose(
    addField,
    translate,
    withStyles(styles)
);

export default enhance(NullableBooleanInput);
