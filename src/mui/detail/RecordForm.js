import React from 'react';
import { Field, reduxForm } from 'redux-form';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { SaveButton } from '../button';
import { Labeled } from '../input';

const RecordForm = ({ children, handleSubmit, record, resource, basePath }) => {
    return (
        <form onSubmit={handleSubmit}>
            <div style={{ padding: '0 1em 1em 1em' }}>
                {React.Children.map(children, input => <div key={input.props.source}>
                    {
                        input.props.reference ?
                            <Labeled
                                label={input.props.label}
                                resource={resource}
                                record={record}
                                basePath={basePath}
                            >
                                {input}
                            </Labeled>
                            :
                            <Field
                                {...input.props}
                                name={input.props.source}
                                component={input.type}
                            />
                    }
                </div>)}
            </div>
            <Toolbar>
                <ToolbarGroup>
                    <SaveButton />
                </ToolbarGroup>
            </Toolbar>
        </form>
    );
};

export default reduxForm({
    form: 'record-form',
})(RecordForm);
