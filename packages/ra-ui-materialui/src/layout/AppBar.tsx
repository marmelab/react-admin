import * as React from 'react';
import { FC } from 'react';
import { styled } from '@mui/material/styles';
import { Children, memo } from 'react';
import PropTypes from 'prop-types';
import {
    AppBar as MuiAppBar,
    AppBarProps as MuiAppBarProps,
    Toolbar,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { ComponentPropType, useLocales } from 'ra-core';

import { SidebarToggleButton } from './SidebarToggleButton';
import { LoadingIndicator } from './LoadingIndicator';
import { UserMenu } from './UserMenu';
import { HideOnScroll } from './HideOnScroll';
import { TitlePortal } from './TitlePortal';
import { LocalesMenuButton } from '../button';
import { useThemesContext } from './Theme/useThemesContext';
import { ToggleThemeButton } from '../button/ToggleThemeButton';

/**
 * The AppBar component renders a custom MuiAppBar.
 *
 * @param {Object} props
 * @param {ReactNode} props.children React node/s to be rendered as children of the AppBar
 * @param {string} props.className CSS class applied to the MuiAppBar component
 * @param {string} props.color The color of the AppBar
 * @param {Element | boolean} props.userMenu A custom user menu component for the AppBar. <UserMenu/> component by default. Pass false to disable.
 *
 * @example // add a custom button to the AppBar
 *
 * const MyAppBar = () => (
 *   <AppBar>
 *     <TitlePortal />
 *     <MyCustomButton />
 *   </AppBar>
 * );
 *
 * @example // without a user menu
 *
 * const MyAppBar = () => <AppBar userMenu={false} />;
 */
export const AppBar: FC<AppBarProps> = memo(props => {
    const {
        alwaysOn,
        children,
        className,
        color = 'secondary',
        open,
        title,
        toolbar = defaultToolbarElement,
        userMenu = DefaultUserMenu,
        container: Container = alwaysOn ? 'div' : HideOnScroll,
        ...rest
    } = props;

    const isXSmall = useMediaQuery<Theme>(theme =>
        theme.breakpoints.down('sm')
    );

    return (
        <Container className={className}>
            <StyledAppBar
                className={AppBarClasses.appBar}
                color={color}
                {...rest}
            >
                <Toolbar
                    disableGutters
                    variant={isXSmall ? 'regular' : 'dense'}
                    className={AppBarClasses.toolbar}
                >
                    <SidebarToggleButton className={AppBarClasses.menuButton} />
                    {Children.count(children) === 0 ? (
                        <TitlePortal className={AppBarClasses.title} />
                    ) : (
                        children
                    )}
                    {toolbar}
                    {typeof userMenu === 'boolean' ? (
                        userMenu === true ? (
                            <UserMenu />
                        ) : null
                    ) : (
                        userMenu
                    )}
                </Toolbar>
            </StyledAppBar>
        </Container>
    );
});

const DefaultToolbar = () => {
    const locales = useLocales();
    const { darkTheme } = useThemesContext();
    return (
        <>
            {locales && locales.length > 1 ? <LocalesMenuButton /> : null}
            {darkTheme && <ToggleThemeButton />}
            <LoadingIndicator />
        </>
    );
};

const defaultToolbarElement = <DefaultToolbar />;

AppBar.propTypes = {
    alwaysOn: PropTypes.bool,
    children: PropTypes.node,
    className: PropTypes.string,
    color: PropTypes.oneOf([
        'default',
        'inherit',
        'primary',
        'secondary',
        'transparent',
    ]),
    container: ComponentPropType,
    /**
     * @deprecated
     */
    open: PropTypes.bool,
    toolbar: PropTypes.element,
    userMenu: PropTypes.oneOfType([PropTypes.element, PropTypes.bool]),
};

const DefaultUserMenu = <UserMenu />;

export interface AppBarProps extends Omit<MuiAppBarProps, 'title'> {
    /**
     * This prop is injected by Layout. You should not use it directly unless
     * you are using a custom layout.
     * If you are using the default layout, use `<Layout appBarAlwaysOn>` instead.
     */
    alwaysOn?: boolean;
    container?: React.ElementType<any>;
    /**
     * @deprecated injected by Layout but not used by this AppBar
     */
    open?: boolean;
    /**
     * @deprecated injected by Layout but not used by this AppBar
     */
    title?: string | JSX.Element;
    toolbar?: JSX.Element;
    userMenu?: JSX.Element | boolean;
}

const PREFIX = 'RaAppBar';

export const AppBarClasses = {
    appBar: `${PREFIX}-appBar`,
    toolbar: `${PREFIX}-toolbar`,
    menuButton: `${PREFIX}-menuButton`,
    menuButtonIconClosed: `${PREFIX}-menuButtonIconClosed`,
    menuButtonIconOpen: `${PREFIX}-menuButtonIconOpen`,
    title: `${PREFIX}-title`,
};

const StyledAppBar = styled(MuiAppBar, {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .${AppBarClasses.toolbar}`]: {
        padding: `0 ${theme.spacing(1)}`,
        [theme.breakpoints.down('md')]: {
            minHeight: theme.spacing(6),
        },
    },
    [`& .${AppBarClasses.menuButton}`]: {
        marginRight: '0.2em',
    },
    [`& .${AppBarClasses.title}`]: {},
}));
