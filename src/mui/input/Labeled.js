import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

/**
 * Higher-order component to add a label to any component.
 *
 * Useful to use custom components (or fields) in Edit and Create components.
 *
 * @example
 * <Labeled label="Comments">
 *     <FooComponent source="title" />
 * </Labeled>
 */
const Labeled = ({ label, resource, record, onChange, basePath, children }) => {
    const props = { ...children.props, record, resource, onChange, basePath };
    return (
        <TextField floatingLabelText={label} floatingLabelFixed disabled fullWidth underlineShow={false}>
            <children.type {...props} />
        </TextField>
    );
};

Labeled.propTypes = {
    label: PropTypes.string.isRequired,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    onChange: PropTypes.func,
    children: PropTypes.element,
};

export default Labeled;
