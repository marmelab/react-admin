import * as React from 'react';
import { CoreAdmin, CoreAdminProps } from '../core/CoreAdmin';

import { Layout } from './Layout';
import { defaultI18nProvider } from './defaultI18nProvider';

export const Admin = (props: CoreAdminProps) => {
    const { layout = Layout } = props;
    return (
        <CoreAdmin
            i18nProvider={defaultI18nProvider}
            layout={layout}
            {...props}
        />
    );
};
