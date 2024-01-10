import * as React from 'react';
import { AppBar as RaAppBar, AppBarProps } from 'react-admin';
import { UserMenu } from './UserMenu';

export const AppBar = (props: AppBarProps) => (
    <RaAppBar {...props} userMenu={<UserMenu />} />
);
