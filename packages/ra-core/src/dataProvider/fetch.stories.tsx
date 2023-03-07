import * as React from 'react';
import { fetchJson } from './fetch';

export default {
    title: 'ra-core/dataProvider/fetch',
};

export const FetchJson = () => {
    const [token, setToken] = React.useState('secret');
    const [record, setRecord] = React.useState('');
    const [headerName, setHeaderName] = React.useState('X-Custom-Header');
    const [headerValue, setHeaderValue] = React.useState('foobar');

    const user = { token: `Bearer ${token}`, authenticated: !!token };

    const getHeaders = () => {
        const headers = new Headers();
        if (headerName) headers.set(headerName, headerValue);
        return headers;
    };

    const doGet = () => {
        fetchJson('https://jsonplaceholder.typicode.com/posts/1', {
            user,
            headers: getHeaders(),
        }).then(({ status, headers, body, json }) => {
            console.log('GET result', { status, headers, body, json });
            setRecord(body);
        });
    };

    const doPut = () => {
        fetchJson('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'PUT',
            body: record,
            user,
            headers: getHeaders(),
        }).then(({ status, headers, body, json }) => {
            console.log('PUT result', { status, headers, body, json });
            setRecord(body);
        });
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: 500,
                padding: 20,
                gap: 10,
            }}
        >
            <p style={{ backgroundColor: '#ffb', textAlign: 'center' }}>
                <b>Tip:</b> Open the DevTools network tab to see the HTTP
                Headers
                <br />
                <b>Tip:</b> Open the DevTools console tab to see the returned
                values
            </p>
            <div style={{ display: 'flex' }}>
                <label htmlFor="token" style={{ marginRight: 10 }}>
                    Token:
                </label>
                <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    style={{ flexGrow: 1 }}
                    title="Clear this field to simulate an unauthenticated user"
                />
            </div>
            <div style={{ display: 'flex' }}>
                <label
                    htmlFor="header-name"
                    style={{ flexShrink: 0, marginRight: 10 }}
                >
                    Custom header:
                </label>
                <input
                    id="header-name"
                    placeholder="header name"
                    type="text"
                    value={headerName}
                    onChange={e => setHeaderName(e.target.value)}
                    style={{ flexGrow: 1, marginRight: 10 }}
                    title="Clear this field to remove the header"
                />
                <input
                    id="header-value"
                    placeholder="header value"
                    type="text"
                    value={headerValue}
                    onChange={e => setHeaderValue(e.target.value)}
                    style={{ flexGrow: 1, minWidth: 100 }}
                />
            </div>
            <button onClick={doGet}>Send GET request</button>
            <textarea
                value={record}
                rows={10}
                onChange={e => setRecord(e.target.value)}
                placeholder="body"
            />
            <button onClick={doPut} disabled={!record}>
                Send PUT request
            </button>
        </div>
    );
};
