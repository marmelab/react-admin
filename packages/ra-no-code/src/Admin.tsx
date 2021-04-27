import React from 'react';
import { Admin as RaAdmin, Resource } from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { CreateBuilder, EditBuilder, ListBuilder } from './builders';
import {
    useResourceConfigurations,
    ResourceConfigurationProvider,
} from './ResourceConfiguration';
import { Layout, Ready } from './ui';

const dataProvider = localStorageDataProvider();

export const Admin = () => (
    <ResourceConfigurationProvider>
        <InnerAdmin />
    </ResourceConfigurationProvider>
);

const InnerAdmin = () => {
    const { resources } = useResourceConfigurations();
    const hasResources = !!resources && Object.keys(resources).length > 0;
    return (
        <RaAdmin dataProvider={dataProvider} ready={Ready} layout={Layout}>
            {hasResources
                ? Object.keys(resources).map(resource => (
                      <Resource
                          key={resource}
                          name={resource}
                          options={{ label: resources[resource].label }}
                          list={ListBuilder}
                          edit={EditBuilder}
                          create={CreateBuilder}
                      />
                  ))
                : undefined}
        </RaAdmin>
    );
};
