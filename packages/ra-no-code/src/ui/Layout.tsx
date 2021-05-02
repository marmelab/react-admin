import React from 'react';
import { Layout as RaLayout, LayoutProps } from 'react-admin';
import Menu from './Menu';

export const Layout = (props: LayoutProps) => (
    <RaLayout {...props} menu={Menu} />
);
