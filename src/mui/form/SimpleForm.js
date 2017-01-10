import React, { PropTypes } from 'react';
import { reduxForm } from 'redux-form';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { validateForm } from '../../util/validate';
import { SaveButton } from '../button';
import FormField from './FormField';

export const SimpleForm = ({ children, handleSubmit, record, resource, basePath }) => (
    <form onSubmit={handleSubmit}>
        <div style={{ padding: '0 1em 1em 1em' }}>
            {React.Children.map(children, input => (
                <div key={input.props.source} style={input.props.style}>
                    <FormField input={input} resource={resource} record={record} basePath={basePath} />
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
