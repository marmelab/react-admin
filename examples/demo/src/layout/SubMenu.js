import React, { Fragment } from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';

import { translate } from 'react-admin';

const styles = {
    listItem: {
        paddingLeft: '1rem',
    },
    listItemText: {
        paddingLeft: 2,
        fontSize: '1rem',
    },
    sidebarIsOpen: {
        paddingLeft: 25,
        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
    sidebarIsClosed: {
        paddingLeft: 0,
        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
};

const SubMenu = ({
    handleToggle,
    sidebarIsOpen,
    isOpen,
    name,
    icon,
    classes,
    children,
    translate,
}) => (
    <Fragment>
        <ListItem
            dense
            button
            onClick={handleToggle}
            className={classes.listItem}
        >
            <ListItemIcon>{isOpen ? <ExpandMore /> : icon}</ListItemIcon>
            <ListItemText
                inset
                primary={isOpen ? translate(name) : ''}
                secondary={isOpen ? '' : translate(name)}
                className={classes.listItemText}
            />
        </ListItem>
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

export default withStyles(styles)(translate(SubMenu));
