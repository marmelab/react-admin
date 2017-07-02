import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import FlatButton from 'material-ui/FlatButton';
import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import Divider from 'material-ui/Divider';

import EmbeddedArrayInputFormField from './EmbeddedArrayInputFormField';

const styles = {
    container: {
        padding: '0 1em 1em 1em',
        width: '90%',
        display: 'inline-block',
    },
    removeButton: {
        float: 'right',
        marginTop: '1em',
    },
};

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
 *                       <TextInput source="url" />
 *                       <TextInput source="context"/>
 *                   </SimpleList>
 *               </EmbeddedArrayInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export class EmbeddedArrayInput extends Component {

    renderListItem = ({ fields, inputs, member, index }) => {
        const removeElement = () => fields.remove(index);
        return (
            <div className="EmbeddedArrayInputItemContainer">
                <div style={styles.container}>
                    {
                        React.Children.map(inputs, input => input && (
                            <div key={input.props.source} className={`aor-input-${input.props.source}`} style={input.props.style}>
                                <EmbeddedArrayInputFormField input={input} prefix={member} />
                            </div>
                        ))
                    }
                </div>
                <FlatButton
                    primary
                    label="Remove"
                    style={styles.removeButton}
                    icon={<ActionDeleteIcon />}
                    onClick={removeElement}
                />
            </div>
        );
    };


    renderList = ({ fields }) => {
        const { children, elStyle } = this.props;
        return (
            <div className="EmbeddedArrayInputContainer" style={elStyle}>
                <div>
                    {
                        fields.map((member, index) => (
                            <div key={index}>
                                { this.renderListItem({ fields, inputs: children, member, index }) }
                                { index < fields.length - 1 && <Divider /> }
                            </div>
                        ))
                    }
                </div>
                <br />
                <FlatButton
                    primary
                    icon={<ContentCreateIcon />}
                    label="Add"
                    onClick={() => fields.push({})}
                />
            </div>
        );
    };

    render() {
        const { source } = this.props;

        return <FieldArray name={source} component={this.renderList} />;
    }
}

EmbeddedArrayInput.propTypes = {
    addField: PropTypes.bool.isRequired,
    addLabel: PropTypes.bool.isRequired,
    allowEmpty: PropTypes.bool.isRequired,
    basePath: PropTypes.string,
    children: PropTypes.node.isRequired,
    label: PropTypes.string,
    meta: PropTypes.object,
    onChange: PropTypes.func,
    input: PropTypes.object,
    source: PropTypes.string,
    arrayElStyle: PropTypes.object,
    elStyle: PropTypes.object,
};

EmbeddedArrayInput.defaultProps = {
    addField: false,
    allowEmpty: true,
};

export default EmbeddedArrayInput;
