import React from 'react';
import { Layout as RaLayout } from 'react-admin';
import { useResourcesConfiguration } from '../ResourceConfiguration';
import { Menu } from './Menu';
import { AppBar } from './Appbar';
import { Ready } from './Ready';

export const Layout = ({ children }: { children: React.ReactNode }) => {
    const [resources] = useResourcesConfiguration();
    const hasResources = !!resources && Object.keys(resources).length > 0;

    if (!hasResources) {
        return <Ready />;
    }

    return (
        <RaLayout appBar={AppBar} menu={Menu}>
            {children}
        </RaLayout>
    );
};
