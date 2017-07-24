import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FieldArray } from 'redux-form';

import FlatButton from 'material-ui/FlatButton';
import TextFieldLabel from 'material-ui/TextField/TextFieldLabel';
import ContentCreateIcon from 'material-ui/svg-icons/content/create';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import Divider from 'material-ui/Divider';

import translate from '../../i18n/translate';

import EmbeddedArrayInputFormField from '../form/EmbeddedArrayInputFormField';

const styles = {
    container: {
        padding: '0 1em 1em 0em',
        width: '90%',
        display: 'inline-block',
    },
    innerContainer: {
        padding: '0 1em 1em 1em',
        width: '90%',
        display: 'inline-block',
    },
    labelContainer: {
        padding: '1.2em 1em 0 0',
        width: '90%',
        display: 'inline-block',
    },
    label: {
        top: 0,
        position: 'relative',
        textTransform: 'capitalize',
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
        addLabel: PropTypes.bool.isRequired,
        addField: PropTypes.bool.isRequired,
        allowEmpty: PropTypes.bool.isRequired,
        allowAdd: PropTypes.bool.isRequired,
        allowRemove: PropTypes.bool.isRequired,
        arrayElStyle: PropTypes.object,
        basePath: PropTypes.string,
        children: PropTypes.node.isRequired,
        disabled: PropTypes.bool,
        elStyle: PropTypes.object,
        input: PropTypes.object,
        label: PropTypes.string,
        labelAdd: PropTypes.string.isRequired,
        labelRemove: PropTypes.string.isRequired,
        meta: PropTypes.object,
        onChange: PropTypes.func,
        resource: PropTypes.string,
        readOnly: PropTypes.bool,
        record: PropTypes.object,
        source: PropTypes.string,
    };

    static defaultProps = {
        addLabel: false,
        addField: false,
        allowEmpty: true,
        allowAdd: true,
        allowRemove: true,
        labelAdd: 'aor.input.embedded_array.add',
        labelRemove: 'aor.input.embedded_array.remove',
    };

    static contextTypes = {
        muiTheme: PropTypes.object.isRequired,
    };

    renderListItem = ({
        allowRemove,
        items,
        inputs,
        member,
        index,
        translate,
        labelRemove,
        readOnly,
        disabled,
        resource,
    }) => {
        const removeItem = () => items.remove(index);
        const passedProps = {
            resource: this.props.resource || resource,
            basePath: this.props.basePath,
            record: this.props.record,
        };

        return (
            <div className="EmbeddedArrayInputItemContainer">
                <div style={styles.innerContainer}>
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
                {allowRemove &&
                    !readOnly &&
                    !disabled &&
                    <FlatButton
                        primary
                        label={translate(labelRemove)}
                        style={styles.removeButton}
                        icon={<ActionDeleteIcon />}
                        onClick={removeItem}
                    />}
            </div>
        );
    };

    renderList = ({ fields: items }) => {
        const {
            children,
            style,
            translate,
            labelRemove,
            labelAdd,
            allowAdd,
            allowRemove,
            readOnly,
            disabled,
        } = this.props;
        const createItem = () => items.push();

        const resource = this.props.resource || this.props.props.resource;

        return (
            <div className="EmbeddedArrayInputContainer" style={style}>
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
                                allowRemove,
                                readOnly,
                                disabled,
                                resource,
                            })}
                            {index < items.length - 1 && <Divider />}
                        </div>
                    )}
                </div>
                <br />
                {allowAdd &&
                    !readOnly &&
                    !disabled &&
                    <FlatButton
                        primary
                        icon={<ContentCreateIcon />}
                        label={translate(labelAdd)}
                        onClick={createItem}
                    />}
            </div>
        );
    };

    render() {
        const { source, label, addLabel } = this.props;

        const labelElement =
            !addLabel &&
            <div style={styles.labelContainer}>
                <TextFieldLabel
                    muiTheme={this.context.muiTheme}
                    style={Object.assign(styles.label, {
                        color: this.context.muiTheme
                            ? this.context.muiTheme.textField.focusColor
                            : '',
                    })}
                    shrink={false}
                >
                    {label || source.split('.').pop()}
                </TextFieldLabel>
            </div>;

        return (
            <div>
                {labelElement}
                <FieldArray
                    name={source}
                    component={this.renderList}
                    props={this.props}
                />
            </div>
        );
    }
}

export default translate(EmbeddedArrayInput);
