import React, { PropTypes } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { validateForm } from '../../util/validate';
import { SaveButton } from '../button';
import Labeled from '../input/Labeled';

export const SimpleForm = ({ children, handleSubmit, record, resource, basePath }) => {
    const commonProps = { resource, record, basePath };
    return (
        <form onSubmit={handleSubmit}>
            <div style={{ padding: '0 1em 1em 1em' }}>
                {React.Children.map(children, input => (
                    <div key={input.props.source} style={input.props.style}>
                        { input.props.addField ?
                            (input.props.addLabel ?
                                <Field {...commonProps} {...input.props} name={input.props.source} component={Labeled} label={input.props.label}>{ input }</Field> :
                                <Field {...commonProps} {...input.props} name={input.props.source} component={input.type} />
                            ) :
                            (input.props.addLabel ?
                                <Labeled {...commonProps} label={input.props.label} source={input.props.source}>{input}</Labeled> :
                                (typeof input.type === 'string' ?
                                    input :
                                    React.cloneElement(input, commonProps)
                                )
                            )
                        }
                    </div>
                ))}
            </div>
            <Toolbar>
                <ToolbarGroup>
                    <SaveButton />
                </ToolbarGroup>
            </Toolbar>
        </form>
    );
};

SimpleForm.propTypes = {
    children: PropTypes.node,
    handleSubmit: PropTypes.func,
    record: PropTypes.object,
    resource: PropTypes.string,
    basePath: PropTypes.string,
    validation: PropTypes.func,
};

export default reduxForm({
    form: 'record-form',
    validate: validateForm,
})(SimpleForm);
