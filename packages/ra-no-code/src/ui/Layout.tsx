import React from 'react';
import { Layout as RaLayout, LayoutProps } from 'react-admin';
import { useResourcesConfiguration } from '../ResourceConfiguration';
import { Menu } from './Menu';
import { AppBar } from './Appbar';
import { Ready } from './Ready';

export const Layout = (props: LayoutProps) => {
    const [resources] = useResourcesConfiguration();
    const hasResources = !!resources && Object.keys(resources).length > 0;

    if (!hasResources) {
        return <Ready />;
    }

    return <RaLayout {...props} appBar={AppBar} menu={Menu} />;
};
