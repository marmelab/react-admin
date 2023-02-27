import * as React from 'react';
import { fetchJson } from './fetch';

export default {
    title: 'ra-core/dataProvider/fetch',
};

export const WithAuthenticatedUser = () => {
    const [token, setToken] = React.useState('secret');
    const [record, setRecord] = React.useState('');
    const user = { token: `Bearer ${token}`, authenticated: !!token };
    const doGet = () => {
        fetchJson('https://jsonplaceholder.typicode.com/posts/1', {
            user,
        }).then(({ body }) => setRecord(body));
    };
    const doPut = () => {
        fetchJson('https://jsonplaceholder.typicode.com/posts/1', {
            method: 'PUT',
            body: record,
            user,
        }).then(({ body }) => setRecord(body));
    };
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                width: 500,
                padding: 20,
            }}
        >
            <div style={{ display: 'flex' }}>
                <span style={{ marginRight: 10 }}>Token:</span>
                <input
                    type="text"
                    value={token}
                    onChange={e => setToken(e.target.value)}
                    style={{ flexGrow: 1 }}
                />
            </div>
            <button onClick={doGet}>GET</button>
            <p>Open the DevTools console to see the computed HTTP Headers</p>
            <textarea
                value={record}
                rows={10}
                onChange={e => setRecord(e.target.value)}
            />
            <button onClick={doPut} disabled={!record}>
                PUT
            </button>
        </div>
    );
};
