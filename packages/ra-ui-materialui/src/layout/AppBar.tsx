import * as React from 'react';
import { FC, Children, memo } from 'react';
import {
    type ComponentsOverrides,
    styled,
    useThemeProps,
} from '@mui/material/styles';
import {
    AppBar as MuiAppBar,
    type AppBarProps as MuiAppBarProps,
    Toolbar,
    useMediaQuery,
    Theme,
} from '@mui/material';
import { useLocales } from 'ra-core';

import { SidebarToggleButton } from './SidebarToggleButton';
import { LoadingIndicator } from './LoadingIndicator';
import { UserMenu } from './UserMenu';
import { HideOnScroll } from './HideOnScroll';
import { TitlePortal } from './TitlePortal';
import { LocalesMenuButton } from '../button';
import { useThemesContext } from '../theme/useThemesContext';
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
export const AppBar: FC<AppBarProps> = memo(inProps => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        alwaysOn,
        children,
        className,
        color = 'secondary',
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

const DefaultUserMenu = <UserMenu />;

export interface AppBarProps extends MuiAppBarProps {
    /**
     * This prop is injected by Layout. You should not use it directly unless
     * you are using a custom layout.
     * If you are using the default layout, use `<Layout appBarAlwaysOn>` instead.
     */
    alwaysOn?: boolean;
    container?: React.ElementType<any>;
    toolbar?: React.ReactNode;
    userMenu?: React.ReactNode;
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

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaAppBar:
            | 'root'
            | 'appBar'
            | 'toolbar'
            | 'menuButton'
            | 'menuButtonIconClosed'
            | 'menuButtonIconOpen'
            | 'title';
    }

    interface ComponentsPropsList {
        RaAppBar: Partial<AppBarProps>;
    }

    interface Components {
        RaAppBar?: {
            defaultProps?: ComponentsPropsList['RaAppBar'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaAppBar'];
        };
    }
}
