import * as React from 'react';
import { styled } from '@mui/material/styles';
import { MouseEvent, ReactElement, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import { ImportResourceDialog } from './ImportResourceDialog';
import {
    ListItemIcon,
    ListItemText,
    MenuItem,
    MenuItemProps,
    Tooltip,
} from '@mui/material';

const PREFIX = 'RaMenuItemLink';

const classes = {
    root: `${PREFIX}-root`,
    active: `${PREFIX}-active`,
    icon: `${PREFIX}-icon`,
};

const Root = styled('div')(({ theme }) => ({
    [`& .${classes.root}`]: {
        color: theme.palette.text.secondary,
    },

    [`& .${classes.active}`]: {
        color: theme.palette.text.primary,
    },

    [`& .${classes.icon}`]: { minWidth: theme.spacing(5) },
}));

export const NewResourceMenuItem = (
    props: MenuItemProps<'li', { button?: true } & { sidebarIsOpen: boolean }>
) => {
    const { sidebarIsOpen, ...rest } = props;
    const [showImportResourceDialog, setShowImportResourceDialog] = useState(
        false
    );

    const handleClick = (
        event: MouseEvent<HTMLAnchorElement> & MouseEvent<HTMLLIElement>
    ) => {
        setShowImportResourceDialog(true);
    };

    const handleCloseImportNewResourceDialog = () => {
        setShowImportResourceDialog(false);
    };

    const primaryText = 'New resource';

    const renderMenuItem = (): ReactElement => (
        <MenuItem
            className={classes.root}
            tabIndex={0}
            {...rest}
            onClick={handleClick}
        >
            <ListItemIcon className={classes.icon}>
                <AddIcon titleAccess={primaryText} />
            </ListItemIcon>
            <ListItemText>{primaryText}</ListItemText>
        </MenuItem>
    );

    return (
        <Root>
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
        </Root>
    );
};
