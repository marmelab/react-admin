import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { createHashRouter } from 'react-router-dom';
import { App } from './App';

const router = createHashRouter([
    {
        path: '*',
        element: <App />
    }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
