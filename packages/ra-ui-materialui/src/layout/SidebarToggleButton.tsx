import * as React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import { useTranslate } from 'ra-core';
import { ClassesOverride } from '../types';
import { useToggleSidebar } from './useToggleSidebar';

/**
 * A button that toggles the sidebar. Used by default in the <AppBar>.
 * @param props The component props
 * @param {String} props.className An optional class name to apply to the button
 * @param {ClassesOverride<typeof useStyles>} props.classes An object containing styles.
 */
export const SidebarToggleButton = (props: SidebarToggleButtonProps) => {
    const translate = useTranslate();
    const classes = useStyles(props);
    const { className } = props;
    const [open, toggleSidebar] = useToggleSidebar();

    return (
        <Tooltip
            title={translate(
                open ? 'ra.action.close_menu' : 'ra.action.open_menu',
                {
                    _: 'Open/Close menu',
                }
            )}
            enterDelay={500}
        >
            <IconButton
                color="inherit"
                onClick={() => toggleSidebar()}
                className={className}
            >
                <MenuIcon
                    classes={{
                        root: open
                            ? classes.menuButtonIconOpen
                            : classes.menuButtonIconClosed,
                    }}
                />
            </IconButton>
        </Tooltip>
    );
};

const useStyles = makeStyles(
    theme => ({
        menuButtonIconClosed: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(0deg)',
        },
        menuButtonIconOpen: {
            transition: theme.transitions.create(['transform'], {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            transform: 'rotate(180deg)',
        },
    }),
    { name: 'RaSidebarToggleButton' }
);

export type SidebarToggleButtonProps = {
    className?: string;
    classes?: ClassesOverride<typeof useStyles>;
};
