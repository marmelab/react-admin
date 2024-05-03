import * as React from 'react';
import { Route } from 'react-router';
import { CoreAdmin } from './CoreAdmin';
import { CustomRoutes } from './CustomRoutes';

export default {
    title: 'ra-core/core/CoreAdmin',
};

const BuggyComponent = () => {
    throw new Error('Something went wrong...');
};

export const DefaultError = () => (
    <CoreAdmin>
        <CustomRoutes noLayout>
            <Route path="/" element={<BuggyComponent />} />
        </CustomRoutes>
    </CoreAdmin>
);

const MyError = ({
    error,
    errorInfo,
}: {
    error?: Error;
    errorInfo?: React.ErrorInfo;
}) => (
    <div style={{ backgroundColor: 'purple', color: 'white', height: '100vh' }}>
        <h1>{error?.message}</h1>
        <pre>{errorInfo?.componentStack}</pre>
    </div>
);

export const CustomError = () => (
    <CoreAdmin error={MyError}>
        <CustomRoutes noLayout>
            <Route path="/" element={<BuggyComponent />} />
        </CustomRoutes>
    </CoreAdmin>
);
