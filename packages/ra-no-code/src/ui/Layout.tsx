import React from 'react';
import { Layout as RaLayout, LayoutProps } from 'react-admin';
import { Menu } from './Menu';
import { AppBar } from './Appbar';

export const Layout = (props: LayoutProps) => (
    <RaLayout {...props} appBar={AppBar} menu={Menu} />
);
