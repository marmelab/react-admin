import React from 'react';

const InputList = ({ record, inputs, resource, handleChange, basePath }) => (
    <div>
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

export default InputList;
