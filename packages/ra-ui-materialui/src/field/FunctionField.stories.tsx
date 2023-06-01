import * as React from 'react';

import { RecordContextProvider } from 'ra-core';
import { FunctionField } from './FunctionField';

export default { title: 'ra-ui-materialui/fields/FunctionField' };

export const Basic = () => (
    <RecordContextProvider value={{ firstName: 'John', lastName: 'Doe' }}>
        <FunctionField
            render={record => `${record.firstName} ${record.lastName}`}
        />
    </RecordContextProvider>
);

type User = {
    id: number;
    firstName: string;
    lastName: string;
};

export const Typed = () => (
    <RecordContextProvider<User>
        value={{ id: 123, firstName: 'John', lastName: 'Doe' }}
    >
        <FunctionField<User>
            render={record => `${record?.firstName} ${record?.lastName}`}
        />
    </RecordContextProvider>
);

export const NonRegression = () => (
    <RecordContextProvider value={{ firstName: 'John', lastName: 'Doe' }}>
        <FunctionField
            render={(record?: User) =>
                `${record?.firstName} ${record?.lastName}`
            }
        />
    </RecordContextProvider>
);
