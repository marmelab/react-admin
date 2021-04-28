import React from 'react';
import { Admin as RaAdmin, Resource } from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { Create, Edit, List } from './builders';
import {
    useResourcesConfiguration,
    ResourceConfigurationProvider,
} from './ResourceConfiguration';
import { Layout, Ready } from './ui';

const dataProvider = localStorageDataProvider();

export const Admin = () => (
    <ResourceConfigurationProvider dataProvider={dataProvider}>
        <InnerAdmin />
    </ResourceConfigurationProvider>
);

const InnerAdmin = () => {
    const [resources] = useResourcesConfiguration();
    const hasResources = !!resources && Object.keys(resources).length > 0;
    return (
        <RaAdmin dataProvider={dataProvider} ready={Ready} layout={Layout}>
            {hasResources
                ? Object.keys(resources).map(resource => (
                      <Resource
                          key={resource}
                          name={resource}
                          options={{ label: resources[resource].label }}
                          list={List}
                          edit={Edit}
                          create={Create}
                      />
                  ))
                : undefined}
        </RaAdmin>
    );
};
