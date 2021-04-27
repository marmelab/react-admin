import React from 'react';
import { Admin as RaAdmin, Resource } from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { CreateBuilder, EditBuilder, ListBuilder } from './builders';
import { useResources, ResourceBuilderContext } from './ResourceBuilderContext';
import { Layout, Ready } from './ui';

const dataProvider = localStorageDataProvider();

export const Admin = () => {
    const resourcesState = useResources();
    const resources = resourcesState[0];
    const hasResources = Object.keys(resources).length > 0;

    return (
        <ResourceBuilderContext.Provider value={resourcesState}>
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
        </ResourceBuilderContext.Provider>
    );
};
