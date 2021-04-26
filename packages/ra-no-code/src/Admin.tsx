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

    return (
        <ResourceBuilderContext.Provider value={resourcesState}>
            <RaAdmin dataProvider={dataProvider} ready={Ready} layout={Layout}>
                {resources?.map(resource => (
                    <Resource
                        key={resource.name}
                        name={resource.name}
                        options={{ label: resource.label }}
                        list={ListBuilder}
                        edit={EditBuilder}
                        create={CreateBuilder}
                    />
                ))}
            </RaAdmin>
        </ResourceBuilderContext.Provider>
    );
};
