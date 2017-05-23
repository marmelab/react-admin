import FlatButton from 'material-ui/FlatButton';
import React, { Component } from 'react';
import { FieldArray, Field } from 'redux-form';
import PropTypes from 'prop-types';

import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';

/**
 * An Input component for choosing a reference record. Useful for foreign keys.
 *
 * This component fetches the possible values in the reference resource
 * (using the `CRUD_GET_MATCHING` REST method), then delegates rendering
 * to a subcomponent, to which it passes the possible choices
 * as the `choices` attribute.
 *
 * Use it with a selector component as child, like `<AutocompleteInput>`,
 * `<SelectInput>`, or `<RadioButtonGroupInput>`.
 *
 * @example
 * export const CommentEdit = (props) => (
 *     <Edit {...props}>
 *         <SimpleForm>
 *              <EmbeddedManyInput target="links">
 *                  <SimpleList>
 *                       <TextField source="url" />
 *                       <TextField source="context"/>
 *                   </SimpleList>
 *               </EmbeddedManyInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export class EmbeddedManyInput extends Component {
    constructor(props) {
        super(props);
        const { source } = props;
    }

    componentDidMount() {
        // this.fetchReferenceAndOptions();
    }

    componentWillReceiveProps(nextProps) {
        // if (this.props.record.id !== nextProps.record.id) {
        //     this.fetchReferenceAndOptions(nextProps);
        // }
    }

    renderList = ({ fields }) => {
        console.log(this.props)
        const { children } = this.props;
        return (
            <div style={{ margin: '1em' }}>
                {fields.map((member, index) =>
                    <div key={index} style={{display: 'inline-block', verticalAlign: 'bottom'}}>
                        <div style={{ padding: '0 1em 1em 1em' }}>
                            {React.Children.map(children, input => input && (
                                <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
                                    <Field {...input.props} name={`${member}.${input.props.source}`} component={input.type} />
                                </div>
                            ))}
                        </div>
                        <FlatButton
                            label="Remove"
                            icon={<ActionDeleteIcon />}
                            onClick={() => fields.remove(index)} />
                    </div>
                )}
                <FlatButton icon={<ContentCreateIcon/>} label="Add" onClick={() => fields.push({})} />
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

EmbeddedManyInput.propTypes = {
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
};

EmbeddedManyInput.defaultProps = {
    addField: false,
    allowEmpty: false,
};

export default EmbeddedManyInput;
