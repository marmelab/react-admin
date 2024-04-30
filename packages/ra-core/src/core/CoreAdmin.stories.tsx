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

export const CustomError = () => (
    <CoreAdmin error={() => <h1>Something went wrong...</h1>}>
        <CustomRoutes noLayout>
            <Route path="/error" element={<ErrorComponent />} />
        </CustomRoutes>
    </CoreAdmin>
);
