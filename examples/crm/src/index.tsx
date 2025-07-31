import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { worker } from './providers/fakerest/fakeServer';

const container = document.getElementById('root');
const root = createRoot(container!);

worker.start({ onUnhandledRequest: 'bypass', quiet: true }).then(() => {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
});

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
