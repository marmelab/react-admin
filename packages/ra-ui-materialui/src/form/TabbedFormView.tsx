import * as React from 'react';
import {
    type ChangeEvent,
    Children,
    type ComponentType,
    cloneElement,
    isValidElement,
    type ReactElement,
    useState,
} from 'react';
import clsx from 'clsx';
import { Routes, Route, matchPath, useLocation } from 'react-router-dom';
import { CardContent, Divider } from '@mui/material';
import {
    type ComponentsOverrides,
    styled,
    type SxProps,
    type Theme,
    useThemeProps,
} from '@mui/material/styles';
import { useResourceContext, useSplatPathBase } from 'ra-core';
import { Toolbar } from './Toolbar';
import { TabbedFormTabs, getTabbedFormTabFullPath } from './TabbedFormTabs';

export const TabbedFormView = (inProps: TabbedFormViewProps) => {
    const props = useThemeProps({
        props: inProps,
        name: PREFIX,
    });
    const {
        children,
        className,
        component: Component = DefaultComponent,
        formRootPathname,
        syncWithLocation = true,
        tabs = DefaultTabs,
        toolbar = DefaultToolbar,
        ...rest
    } = props;
    const location = useLocation();
    const resource = useResourceContext(props);
    const [tabValue, setTabValue] = useState(0);
    const splatPathBase = useSplatPathBase();

    const handleTabChange = (event: ChangeEvent<{}>, value: any): void => {
        if (!syncWithLocation) {
            setTabValue(value);
        }
        if (tabs.props.onChange) {
            tabs.props.onChange(event, value);
        }
    };

    const renderTabHeaders = () =>
        cloneElement(
            tabs,
            {
                onChange: handleTabChange,
                syncWithLocation,
                url: formRootPathname,
                value: tabValue,
            },
            children
        );

    return (
        <Root
            className={clsx('tabbed-form', className)}
            {...sanitizeRestProps(rest)}
        >
            {syncWithLocation ? (
                <Routes>
                    <Route path="/*" element={renderTabHeaders()} />
                </Routes>
            ) : (
                renderTabHeaders()
            )}
            <Divider />
            <Component>
                {/* All tabs are rendered (not only the one in focus), to allow validation
                on tabs not in focus. The tabs receive a `hidden` property, which they'll
                use to hide the tab using CSS if it's not the one in focus.
                See https://github.com/marmelab/react-admin/issues/1866 */}
                {Children.map(children, (tab: ReactElement, index) => {
                    if (!tab) {
                        return null;
                    }
                    const tabPath = getTabbedFormTabFullPath(tab, index);
                    const hidden = syncWithLocation
                        ? !matchPath(
                              `${splatPathBase}/${tabPath}`,
                              location.pathname
                          )
                        : tabValue !== index;

                    return isValidElement<any>(tab)
                        ? React.cloneElement(tab, {
                              intent: 'content',
                              resource,
                              hidden,
                              value: syncWithLocation ? tabPath : index,
                          })
                        : null;
                })}
            </Component>
            {toolbar !== false ? toolbar : null}
        </Root>
    );
};

const DefaultTabs = <TabbedFormTabs />;
const DefaultComponent = ({ children }) => (
    <CardContent>{children}</CardContent>
);
const DefaultToolbar = <Toolbar />;

export interface TabbedFormViewProps {
    children?: React.ReactNode;
    className?: string;
    component?: ComponentType<any>;
    resource?: string;
    formRootPathname?: string;
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    toolbar?: React.ReactNode;
    sx?: SxProps<Theme>;
}

const PREFIX = 'RaTabbedForm';

export const TabbedFormClasses = {
    errorTabButton: `${PREFIX}-errorTabButton`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .MuiTab-root.${TabbedFormClasses.errorTabButton}`]: {
        color: (theme.vars || theme).palette.error.main,
    },
}));

const sanitizeRestProps = ({ record, resource, ...rest }: any) => rest;

declare module '@mui/material/styles' {
    interface ComponentNameToClassKey {
        RaTabbedForm: 'root' | 'errorTabButton';
    }

    interface ComponentsPropsList {
        RaTabbedForm: Partial<TabbedFormViewProps>;
    }

    interface Components {
        RaTabbedForm?: {
            defaultProps?: ComponentsPropsList['RaTabbedForm'];
            styleOverrides?: ComponentsOverrides<
                Omit<Theme, 'components'>
            >['RaTabbedForm'];
        };
    }
}
