import FlatButton from 'material-ui/FlatButton';
import React, { Component } from 'react';
import { FieldArray, Field } from 'redux-form';
import PropTypes from 'prop-types';

import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';

/**
 * An Input component for generating/editing an embedded array
 *
 *
 * Use it with any set of input componentents as children, like `<TextInput>`,
 * `<SelectInput>`, `<RadioButtonGroupInput>` ... etc.
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *              <EmbeddedArrayInput source="links">
 *                  <SimpleList>
 *                       <TextField source="url" />
 *                       <TextField source="context"/>
 *                   </SimpleList>
 *               </EmbeddedArrayInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export class EmbeddedArrayInput extends Component {
    constructor(props) {
        super(props);
        // nothing to do for now
    }

    renderList = ({ fields }) => {
        const { children, groupStyle } = this.props;
        return (
            <div className="EmbeddedArrayInputContainer" style={{ margin: '1em' }}>
                <div>
                    {fields.map((member, index) =>
                        <div key={index} style={groupStyle} className="EmbeddedArrayInputItemContainer">
                            <div style={{ padding: '0 1em 1em 1em' }}>
                                {React.Children.map(children, input => input && (
                                    <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
                                        <Field {...input.props} name={`${member}.${input.props.source}`} component={input.type} />
                                    </div>
                                ))}
                            </div>
                            <FlatButton
                                primary
                                label="Remove"
                                icon={<ActionDeleteIcon />}
                                onClick={() => fields.remove(index)} />
                        </div>
                    )}
                </div>
                <FlatButton primary style={{ float: 'right' }} icon={<ContentCreateIcon />} label="Add" onClick={() => fields.push({})} />
                <div style={{ clear: 'both' }} />
            </div>
        )
    }


    render() {
        const { input, resource, label, source, allowEmpty, basePath, onChange, children, meta } = this.props;

        return (
            <FieldArray name={source} component={this.renderList} />
        )
    }
}

EmbeddedArrayInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.node,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    input: PropTypes.object,
    resource: PropTypes.string,
    source: PropTypes.string,
    groupStyle: PropTypes.object
};

EmbeddedArrayInput.defaultProps = {
    addField: false,
    allowEmpty: false,
    groupStyle: {
        display: 'block',
        verticalAlign: 'bottom'
    }
};

export default EmbeddedArrayInput;
