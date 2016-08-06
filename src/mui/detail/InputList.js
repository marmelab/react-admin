import React from 'react';

const Form = ({ record, inputs, resource, handleChange, basePath }) => (
    <div style={{ padding: '0 1em 1em 1em' }}>
    {record ?
        React.Children.map(inputs, input => (
            <div key={input.props.source}>
                <input.type
                    {...input.props}
                    resource={resource}
                    record={record}
                    onChange={handleChange}
                    basePath={basePath}
                />
            </div>
        ))
        :
        null
    }
    </div>
);

export default Form;
