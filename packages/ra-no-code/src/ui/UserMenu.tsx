import * as React from 'react';
import { UserMenu as RaUserMenu } from 'react-admin';
import { ExitApplicationMenu } from './ExitApplicationMenu';

export const UserMenu = props => {
    return (
        <RaUserMenu {...props}>
            <ExitApplicationMenu />
        </RaUserMenu>
    );
};
