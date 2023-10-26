import { DataProvider } from 'ra-core';
import { IntrospectionOptions } from 'ra-data-graphql';

import { RealtimeExtension } from './realtime';

type DataProviderMethod = (...args: any[]) => Promise<{ data: any }>;

export type DataProviderExtension = {
    methodFactory: (
        dataProvider: DataProvider,
        ...args: any[]
    ) => { [k: string]: DataProviderMethod };
    factoryArgs?: any[];
    introspectionOperationNames?: IntrospectionOptions['operationNames'];
};

export class DataProviderExtensions {
    static Realtime = RealtimeExtension;
}
