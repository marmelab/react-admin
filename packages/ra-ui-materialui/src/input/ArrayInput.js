import React, { cloneElement, Component } from 'react';
import PropTypes from 'prop-types';
import { isRequired, FieldTitle } from 'ra-core';
import { FieldArray } from 'redux-form';
import { FormControl } from 'material-ui/Form';
import { InputLabel } from 'material-ui/Input';

import sanitizeRestProps from './sanitizeRestProps';

/**
 * To edit arrays of data embedded inside a record, <ArrayInput> creates a list of sub-forms. 
 *
 *  @example
 * 
 *      import { ArrayInput, SimpleFormIterator, DateInput, UrlInput } from 'react-admin';
 * 
 *      <ArrayInput source="backlinks">
 *          <SimpleFormIterator>
 *              <DateInput source="date" />
 *              <UrlInput source="url" />
 *          </SimpleFormIterator>
 *      </ArrayInput>
 *
 * <ArrayInput> allows the edition of embedded arrays, like the backlinks field
 * in the following post record:
 *
 * {
 *   id: 123
 *   backlinks: [
 *         {
 *             date: '2012-08-10T00:00:00.000Z',
 *             url: 'http://example.com/foo/bar.html',
 *         },
 *         {
 *             date: '2012-08-14T00:00:00.000Z',
 *             url: 'https://blog.johndoe.com/2012/08/12/foobar.html',
 *         }
 *    ]
 * }
 *
 * <ArrayInput> expects a single child, which must be a *form iterator* component.
 * A form iterator is a component accepting a fields object 
 * as passed by redux-form's <FieldArray> component,and defining a sub-form layout.
 * The <SimpleFormIterator> component displays sub-forms in a <Paper>,
 * one sub-form by line. It also provides controls for adding and removing
 * a sub-record (a backlink in this example).
 * 
 * @see https://redux-form.com/7.3.0/examples/fieldarrays/
 */
export class ArrayInput extends Component {
    renderFieldArray = props => {
        const { children } = this.props;
        return cloneElement(children, props);
    };

    render() {
        const {
            className,
            label,
            source,
            resource,
            validate,
            ...rest
        } = this.props;

        return (
            <FormControl
                fullWidth
                margin="normal"
                className={className}
                {...sanitizeRestProps(rest)}
            >
                <InputLabel htmlFor={source} shrink>
                    <FieldTitle
                        label={label}
                        source={source}
                        resource={resource}
                        isRequired={isRequired(validate)}
                    />
                </InputLabel>
                <FieldArray
                    name={source}
                    component={this.renderFieldArray}
                    validate={validate}
                    isRequired={isRequired(validate)}
                />
            </FormControl>
        );
    }
}

ArrayInput.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    isRequired: PropTypes.bool,
    label: PropTypes.string,
    resource: PropTypes.string,
    source: PropTypes.string,
    options: PropTypes.object,
    validate: PropTypes.func,
};

ArrayInput.defaultProps = {
    options: {},
    fullWidth: true,
};
export default ArrayInput;
