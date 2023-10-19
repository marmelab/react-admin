import * as React from 'react';
import { useWatch } from 'react-hook-form';

export const FormInspector = ({ name = 'title' }) => {
    const value = useWatch({ name });
    return (
        <div style={{ backgroundColor: 'lightgrey' }}>
            {name} value in form:&nbsp;
            <code>
                {JSON.stringify(value)} ({typeof value})
            </code>
        </div>
    );
};
