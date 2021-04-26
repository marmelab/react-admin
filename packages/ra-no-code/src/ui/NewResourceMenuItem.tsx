import * as React from 'react';
import { MouseEvent, ReactElement, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import { ImportResourceDialog } from './ImportResourceDialog';
import { makeStyles } from '@material-ui/core/styles';
import {
    ListItemIcon,
    MenuItem,
    MenuItemProps,
    Tooltip,
} from '@material-ui/core';

export const NewResourceMenuItem = (
    props: MenuItemProps<'li', { button?: true } & { sidebarIsOpen: boolean }>
) => {
    const { sidebarIsOpen, ...rest } = props;
    const [showImportResourceDialog, setShowImportResourceDialog] = useState(
        false
    );
    const classes = useStyles(props);

    const handleClick = (
        event: MouseEvent<HTMLAnchorElement> & MouseEvent<HTMLLIElement>
    ) => {
        setShowImportResourceDialog(true);
        props.onClick(event);
    };

    const handleCloseImportNewResourceDialog = () => {
        setShowImportResourceDialog(false);
    };

    const primaryText = 'New resource';

    const renderMenuItem = (): ReactElement => (
        <MenuItem
            className={classes.root}
            // @ts-ignore
            component="button"
            tabIndex={0}
            {...rest}
            onClick={handleClick}
        >
            <ListItemIcon className={classes.icon}>
                <AddIcon titleAccess={primaryText} />
            </ListItemIcon>
            {primaryText}
        </MenuItem>
    );

    return (
        <>
            {sidebarIsOpen ? (
                renderMenuItem()
            ) : (
                <Tooltip title={primaryText} placement="right">
                    {renderMenuItem()}
                </Tooltip>
            )}
            <ImportResourceDialog
                open={showImportResourceDialog}
                onClose={handleCloseImportNewResourceDialog}
            />
        </>
    );
};

const useStyles = makeStyles(
    theme => ({
        root: {
            color: theme.palette.text.secondary,
        },
        active: {
            color: theme.palette.text.primary,
        },
        icon: { minWidth: theme.spacing(5) },
    }),
    { name: 'RaMenuItemLink' }
);
