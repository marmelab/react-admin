import * as React from 'react';
import { forwardRef } from 'react';
import { MenuItemLink, MenuItemLinkProps } from 'react-admin';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { useApplication } from '../ApplicationContext';

export const ExitApplicationMenu = forwardRef<HTMLLIElement>(
    ({ onClick, ...props }: MenuItemLinkProps, ref) => {
        const { onExit } = useApplication();

        const handleClick = () => {
            onExit();
        };

        return (
            <MenuItemLink
                ref={ref}
                to="/"
                primaryText="Exit application"
                leftIcon={<ExitToAppIcon />}
                onClick={handleClick}
                {...props}
            />
        );
    }
);
