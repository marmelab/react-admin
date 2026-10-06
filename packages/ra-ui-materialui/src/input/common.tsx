import * as React from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { DataProvider } from 'ra-core';

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

export const SetFocusButton = ({ source }) => {
    const { setFocus } = useFormContext();
    return (
        <button type="button" onClick={() => setFocus(source)}>
            Set focus on {source}
        </button>
    );
};

export const delayedDataProvider = (
    dataProvider: DataProvider,
    delay = process.env.NODE_ENV === 'test' ? 100 : 300
) =>
    new Proxy(dataProvider, {
        get: (target, name) => (resource, params) => {
            if (typeof name === 'symbol' || name === 'then') {
                return;
            }
            return new Promise(resolve =>
                setTimeout(
                    () => resolve(dataProvider[name](resource, params)),
                    delay
                )
            );
        },
    });
