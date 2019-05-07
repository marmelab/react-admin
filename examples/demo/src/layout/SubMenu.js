import React, { Fragment } from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import { makeStyles } from '@material-ui/styles';

import { useTranslate } from 'react-admin';

const useStyles = makeStyles(theme => ({
    icon: { minWidth: theme.spacing(5) },
    sidebarIsOpen: {
        paddingLeft: 25,
        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
    sidebarIsClosed: {
        paddingLeft: 0,
        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
}));

const SubMenu = ({
    handleToggle,
    sidebarIsOpen,
    isOpen,
    name,
    icon,
    children,
}) => {
    const translate = useTranslate();
    const classes = useStyles();
    return (
        <Fragment>
            <MenuItem dense button onClick={handleToggle}>
                <ListItemIcon className={classes.icon}>
                    {isOpen ? <ExpandMore /> : icon}
                </ListItemIcon>
                <Typography variant="inherit" color="textSecondary">
                    {translate(name)}
                </Typography>
            </MenuItem>
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <List
                    dense
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
                <Divider />
            </Collapse>
        </Fragment>
    );
};

export default SubMenu;
