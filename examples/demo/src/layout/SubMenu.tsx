import React, { FC, Fragment, ReactElement } from 'react';
import ExpandMore from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/core/styles';
import { useTranslate } from 'react-admin';

const useStyles = makeStyles(theme => ({
    icon: {
        minWidth: theme.spacing(5),
        fontSize: '2em',
    },
    sidebarIsOpen: {
        paddingLeft: 25,
        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
    sidebarIsClosed: {
        paddingLeft: 0,
        transition: 'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
    },
}));

interface Props {
    dense: boolean;
    handleToggle: () => void;
    icon: ReactElement;
    isOpen: boolean;
    name: string;
    sidebarIsOpen: boolean;
    style: string;
}

const SubMenu: FC<Props> = ({
    handleToggle,
    sidebarIsOpen,
    isOpen,
    name,
    icon,
    children,
    dense,
    style,
}) => {
    const translate = useTranslate();
    const classes = useStyles();

    const header = (
        <MenuItem dense={dense} button onClick={handleToggle} className={style}>
            <ListItemIcon className={classes.icon}>
                {isOpen ? <ExpandMore /> : icon}
            </ListItemIcon>
            <Typography
                variant="inherit"
                color="textSecondary"
                className={style}
            >
                {translate(name)}
            </Typography>
        </MenuItem>
    );

    return (
        <Fragment>
            {sidebarIsOpen || isOpen ? (
                header
            ) : (
                <Tooltip
                    title={translate(name)}
                    placement="right"
                    className={style}
                >
                    {header}
                </Tooltip>
            )}
            <Collapse
                in={isOpen}
                timeout="auto"
                unmountOnExit
                className={style}
            >
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
                <Divider className={style} />
            </Collapse>
        </Fragment>
    );
};

export default SubMenu;
