import React from 'react';
import Labeled from '../input/Labeled';

const InputList = ({ record, inputs, resource, handleChange, basePath }) => (
    <div>
    {record ?
        React.Children.map(inputs, input => (
            <div key={input.props.source}>
                {input.props.includesLabel ?
                    React.cloneElement(input, {
                        resource,
                        record,
                        onChange: handleChange,
                        basePath,

                    })
                :
                    <Labeled
                        label={input.props.label}
                        resource={resource}
                        record={record}
                        onChange={handleChange}
                        basePath={basePath}
                    >
                        {input}
                    </Labeled>
                }
            </div>
        ))
        :
        null
    }
    </div>
);

export default InputList;
