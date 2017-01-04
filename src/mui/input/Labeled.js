import React, { Component, PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import title from '../../util/title';

const defaultLabelStyle = {
    paddingTop: '2em',
    height: 'auto'
};

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
class Labeled extends Component {
    render() {
        const { input, label, resource, record, onChange, basePath, children, source, disabled = true, labelStyle = defaultLabelStyle } = this.props;
        if (!label && !source) {
            throw new Error(`Cannot create label for component <${children && children.type && children.type.name}>: You must set either the label or source props. You can also disable automated label insertion by setting 'includesLabel: true' in the component default props`);
        }
        return (
            <TextField
                floatingLabelText={title(label, source)}
                floatingLabelFixed
                fullWidth
                disabled={disabled}
                underlineShow={false}
                style={labelStyle}
            >
                {children && React.cloneElement(children, { input, record, resource, onChange, basePath })}
            </TextField>
        );
    }
}

Labeled.propTypes = {
    basePath: PropTypes.string,
    children: PropTypes.element,
    disabled: PropTypes.bool,
    input: PropTypes.object,
    label: PropTypes.string,
    onChange: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    labelStyle: PropTypes.object,
};

Labeled.defaultProps = {
    includesLabel: true,
};

export default Labeled;
