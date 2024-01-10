import * as React from 'react';
import { Layout, LayoutProps } from 'react-admin';
import AppBar from './AppBar';
import Menu from './Menu';

export default (props: LayoutProps) => (
    <Layout {...props} appBar={AppBar} menu={Menu} />
);
