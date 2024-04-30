import * as React from 'react';
import { Route } from 'react-router';
import { CoreAdmin } from './CoreAdmin';
import { CustomRoutes } from './CustomRoutes';
import { FakeBrowserDecorator } from '../storybook/FakeBrowser';

export default {
    title: 'ra-core/Admin',
    decorators: [FakeBrowserDecorator],
    parameters: {
        initialEntries: ['/error'],
    },
};

const ErrorComponent = () => {
    throw Error();
};

export const Error = () => (
    <CoreAdmin>
        <CustomRoutes noLayout>
            <Route path="/error" element={<ErrorComponent />} />
        </CustomRoutes>
    </CoreAdmin>
);

const MyError = ({ errorInfo }: { errorInfo?: React.ErrorInfo }) => (
    <div style={{ backgroundColor: 'purple', color: 'white', height: '100vh' }}>
        <h1>Something went wrong...</h1>
        <p>{errorInfo?.componentStack}</p>
    </div>
);

export const CustomError = () => (
    <CoreAdmin error={MyError}>
        <CustomRoutes noLayout>
            <Route path="/error" element={<ErrorComponent />} />
        </CustomRoutes>
    </CoreAdmin>
);
