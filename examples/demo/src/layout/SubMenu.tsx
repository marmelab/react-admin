import * as React from 'react';
import { FC, Fragment, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import {
    List,
    MenuItem,
    ListItemIcon,
    Typography,
    Collapse,
    Tooltip,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { useTranslate, ReduxState } from 'react-admin';

const useStyles = makeStyles(theme => ({
    icon: { minWidth: theme.spacing(5) },
    sidebarIsOpen: {
        '& a': {
            paddingLeft: theme.spacing(4),
            transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
    },
    sidebarIsClosed: {
        '& a': {
            paddingLeft: theme.spacing(2),
            transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
    },
}));

interface Props {
    dense: boolean;
    handleToggle: () => void;
    icon: ReactElement;
    isOpen: boolean;
    name: string;
}

const SubMenu: FC<Props> = ({
    handleToggle,
    isOpen,
    name,
    icon,
    children,
    dense,
}) => {
    const translate = useTranslate();
    const classes = useStyles();
    const sidebarIsOpen = useSelector<ReduxState, boolean>(
        state => state.admin.ui.sidebarOpen
    );

    const header = (
        <MenuItem dense={dense} button onClick={handleToggle}>
            <ListItemIcon className={classes.icon}>
                {isOpen ? <ExpandMore /> : icon}
            </ListItemIcon>
            <Typography variant="inherit" color="textSecondary">
                {translate(name)}
            </Typography>
        </MenuItem>
    );

    return (
        <Fragment>
            {sidebarIsOpen || isOpen ? (
                header
            ) : (
                <Tooltip title={translate(name)} placement="right">
                    {header}
                </Tooltip>
            )}
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    dense={dense}
                    component="div"
                    disablePadding
                    className={
                        sidebarIsOpen
                            ? classes.sidebarIsOpen
                            : classes.sidebarIsClosed
                    }
                >
                    {children}
                </List>
            </Collapse>
        </Fragment>
    );
};

export default SubMenu;
