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
        const { children, arrayElStyle } = this.props;
        return (
            <div className="EmbeddedArrayInputContainer" style={{ margin: '1em' }}>
                <div>
                    {
                        fields.map((member, index) =>
                            <ArrayElement key={index} fields={fields} inputs={children} elStyle={arrayElStyle} member={member} index={index} />
                        )
                    }
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

const ArrayElement = ({ fields, inputs, member, index, elStyle }) => {
    const removeElement = () => fields.remove(index);
    const containerStyle = { padding: '0 1em 1em 1em' };
    return (
        <div style={elStyle} className="EmbeddedArrayInputItemContainer">
            <div style={containerStyle}>
                {
                    React.Children.map(inputs, input => input && (
                        <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
                            <ArrayElementFormField input={input} prefix={member} />
                        </div>
                    ))
                }
            </div>
            <FlatButton
                primary
                label="Remove"
                icon={<ActionDeleteIcon />}
                onClick={removeElement} />
        </div>
    )
}

import Labeled from './Labeled';
import { required } from '../form/validate';

const isRequired = (validate) => {
    if (validate === required) return true;
    if (Array.isArray(validate)) {
        return validate.includes(required);
    }
    return false;
};

const ArrayElementFormField = ({ input, prefix, ...rest }) => {
    if (input.props.addField) {
        if (input.props.addLabel) {
            return (
                <Field
                    {...rest}
                    {...input.props}
                    name={`${prefix}.${input.props.source}`}
                    component={Labeled}
                    label={input.props.label}
                    isRequired={isRequired(input.props.validate)}
                >
                    { input }
                </Field>
            );
        }
        return (
            <Field
                {...rest}
                {...input.props}
                name={input.props.source}
                component={input.type}
                isRequired={isRequired(input.props.validate)}
            />
        );
    }
    if (input.props.addLabel) {
        return (
            <Labeled
                {...rest}
                label={input.props.label}
                source={input.props.source}
                isRequired={isRequired(input.props.validate)}
            >
                {input}
            </Labeled>
        );
    }
    return (typeof input.type === 'string') ? input : React.cloneElement(input, rest);
};

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
    arrayElStyle: PropTypes.object
};

EmbeddedArrayInput.defaultProps = {
    addField: false,
    allowEmpty: false,
    arrayElStyle: {
        display: 'block',
        verticalAlign: 'bottom'
    }
};

export default EmbeddedArrayInput;
