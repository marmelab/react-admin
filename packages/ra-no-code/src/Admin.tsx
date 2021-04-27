import React from 'react';
import {
    Admin as RaAdmin,
    AdminProps as RaAdminProps,
    Resource,
} from 'react-admin';
import localStorageDataProvider from 'ra-data-local-storage';
import { Create, Edit, List } from './builders';
import {
    useResourcesConfiguration,
    ResourceConfigurationPage,
    ResourceConfigurationProvider,
} from './ResourceConfiguration';
import { Layout, Ready } from './ui';
import { Route } from 'react-router';

const dataProvider = localStorageDataProvider();

const customRoutes = [
    <Route
        path="/configure/:resource"
        render={({ match }) => (
            <ResourceConfigurationPage resource={match.params.resource} />
        )}
    />,
];

export const Admin = (props: AdminProps) => (
    <ResourceConfigurationProvider dataProvider={dataProvider}>
        <InnerAdmin {...props} />
    </ResourceConfigurationProvider>
);

const InnerAdmin = (props: AdminProps) => {
    const [resources] = useResourcesConfiguration();
    const hasResources = !!resources && Object.keys(resources).length > 0;
    return (
        <RaAdmin
            dataProvider={dataProvider}
            ready={Ready}
            layout={Layout}
            customRoutes={customRoutes}
            {...props}
        >
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

interface AdminProps extends Omit<RaAdminProps, 'dataProvider'> {}
