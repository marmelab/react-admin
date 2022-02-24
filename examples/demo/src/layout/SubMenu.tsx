import * as React from 'react';
import { ReactElement, ReactNode } from 'react';
import {
    List,
    MenuItem,
    ListItemIcon,
    Typography,
    Collapse,
    Tooltip,
} from '@mui/material';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useTranslate, useSidebarState } from 'react-admin';

interface Props {
    dense: boolean;
    handleToggle: () => void;
    icon: ReactElement;
    isOpen: boolean;
    name: string;
    children: ReactNode;
}

const SubMenu = (props: Props) => {
    const { handleToggle, isOpen, name, icon, children, dense } = props;
    const translate = useTranslate();

    const [sidebarIsOpen] = useSidebarState();

    const header = (
        <MenuItem dense={dense} onClick={handleToggle}>
            <ListItemIcon sx={{ minWidth: 5 }}>
                {isOpen ? <ExpandMore /> : icon}
            </ListItemIcon>
            <Typography variant="inherit" color="textSecondary">
                {translate(name)}
            </Typography>
        </MenuItem>
    );

    return (
        <div>
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
                    sx={{
                        '& a': {
                            transition:
                                'padding-left 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
                            paddingLeft: sidebarIsOpen ? 4 : 2,
                        },
                    }}
                >
                    {children}
                </List>
            </Collapse>
        </div>
    );
};

export default SubMenu;
