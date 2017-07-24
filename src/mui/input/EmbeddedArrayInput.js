import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import FlatButton from 'material-ui/FlatButton';
import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import Divider from 'material-ui/Divider';

import translate from '../../i18n/translate';

import EmbeddedArrayInputFormField from '../form/EmbeddedArrayInputFormField';

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
 *                  <TextInput source="url" />
 *                  <TextInput source="context"/>
 *                  <ReferenceInput resource="tags" reference="tags" source="tag_id" >
 *                      <SelectInput optionText="name" />
 *                  </ReferenceInput>
 *               </EmbeddedArrayInput>
 *         </SimpleForm>
 *     </Edit>
 * );
 */
export class EmbeddedArrayInput extends Component {
    static propTypes = {
        addField: PropTypes.bool.isRequired,
        allowEmpty: PropTypes.string.isRequired,
        basePath: PropTypes.string,
        resource: PropTypes.string,
        record: PropTypes.object,
        children: PropTypes.node.isRequired,
        labelAdd: PropTypes.string.isRequired,
        labelRemove: PropTypes.string.isRequired,
        meta: PropTypes.object,
        onChange: PropTypes.func,
        input: PropTypes.object,
        source: PropTypes.string,
        arrayElStyle: PropTypes.object,
        elStyle: PropTypes.object,
    };

    static defaultProps = {
        addField: false,
        allowEmpty: true,
        labelAdd: 'aor.input.embedded_array.add',
        labelRemove: 'aor.input.embedded_array.remove',
    };

    renderListItem = ({
        items,
        inputs,
        member,
        index,
        translate,
        labelRemove,
    }) => {
        const removeItem = () => items.remove(index);
        const passedProps = {
            resource: this.props.resource,
            basePath: this.props.basePath,
            record: this.props.record,
        };
        return (
            <div className="EmbeddedArrayInputItemContainer">
                <div style={styles.container}>
                    {React.Children.map(
                        inputs,
                        input =>
                            input &&
                            <div
                                key={input.props.source}
                                className={`aor-input-${member}.${input.props
                                    .source}`}
                                style={input.props.style}
                            >
                                <EmbeddedArrayInputFormField
                                    input={input}
                                    prefix={member}
                                    {...passedProps}
                                />
                            </div>
                    )}
                </div>
                <FlatButton
                    primary
                    label={translate(labelRemove)}
                    style={styles.removeButton}
                    icon={<ActionDeleteIcon />}
                    onClick={removeItem}
                />
            </div>
        );
    };
    //{translate(labelRemove)}
    renderList = ({ fields: items }) => {
        const {
            children,
            elStyle,
            translate,
            labelRemove,
            labelAdd,
        } = this.props;
        const createItem = () => items.push();
        return (
            <div className="EmbeddedArrayInputContainer" style={elStyle}>
                <div>
                    {items.map((member, index) =>
                        <div key={index}>
                            {this.renderListItem({
                                items,
                                inputs: children,
                                member,
                                index,
                                translate,
                                labelRemove,
                            })}
                            {index < items.length - 1 && <Divider />}
                        </div>
                    )}
                </div>
                <br />
                <FlatButton
                    primary
                    icon={<ContentCreateIcon />}
                    label={translate(labelAdd)}
                    onClick={createItem}
                />
            </div>
        );
    };

    render() {
        const { source, translate, labelAdd, labelRemove } = this.props;

        return (
            <FieldArray
                name={source}
                component={this.renderList}
                props={{ translate, labelAdd, labelRemove }}
            />
        );
    }
}

export default translate(EmbeddedArrayInput);
