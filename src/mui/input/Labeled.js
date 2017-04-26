import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import FieldTitle from '../../util/FieldTitle';

const defaultLabelStyle = {
    paddingTop: '2em',
    height: 'auto',
};

/**
 * Use any component as read-only Input, labeled just like other Inputs.
 *
 * Useful to use a Field in the Edit or Create components.
 * The child component will receive the current record.
 *
 * This component name doesn't have a typo. We had to choose between
 * the American English "Labeled", and the British English "Labelled".
 * We flipped a coin.
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
            throw new Error(`Cannot create label for component <${children && children.type && children.type.name}>: You must set either the label or source props. You can also disable automated label insertion by setting 'addLabel: false' in the component default props`);
        }
        return (
            <TextField
                floatingLabelText={<FieldTitle label={label} source={source} resource={resource} />}
                floatingLabelFixed
                fullWidth
                disabled={disabled}
                underlineShow={false}
                style={labelStyle}
            >
                {children && typeof children.type !== 'string' ?
                    React.cloneElement(children, { input, record, resource, onChange, basePath }) :
                    children
                }
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

export default Labeled;
