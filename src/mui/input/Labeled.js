import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import title from '../../util/title';

/**
 * Use any component as read-only Input, labeled just like other Inputs.
 *
 * Useful to use a Field in the Edit or Create components.
 * The child component will receive the current record.
 *
 * @example
 * <Labeled label="Comments">
 *     <FooComponent source="title" />
 * </Labeled>
 */
const Labeled = ({ input, label, resource, record, onChange, basePath, children, source }) => (
    <TextField
        floatingLabelText={title(label, source)}
        floatingLabelFixed
        disabled
        fullWidth
        underlineShow={false}
        style={{ paddingTop: '2em', height: 'auto' }}
    >
        {children && React.cloneElement(children, { input, record, resource, onChange, basePath })}
    </TextField>
);

Labeled.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    input: PropTypes.object,
    label: PropTypes.string.isRequired,
    onChange: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string.isRequired,
};

export default Labeled;
