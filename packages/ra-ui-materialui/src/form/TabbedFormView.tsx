import * as React from 'react';
import {
    ChangeEvent,
    Children,
    ComponentType,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
    useState,
} from 'react';
import clsx from 'clsx';
import {
    Routes,
    Route,
    matchPath,
    useResolvedPath,
    useLocation,
} from 'react-router-dom';
import { CardContent, Divider, SxProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useResourceContext } from 'ra-core';
import { Toolbar } from './Toolbar';
import { TabbedFormTabs, getTabbedFormTabFullPath } from './TabbedFormTabs';

export const TabbedFormView = (props: TabbedFormViewProps): ReactElement => {
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
    const resolvedPath = useResolvedPath('');
    const resource = useResourceContext(props);
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: ChangeEvent<{}>, value: any): void => {
        if (!syncWithLocation) {
            setTabValue(value);
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
                              `${resolvedPath.pathname}/${tabPath}`,
                              // The current location might have encoded segments (e.g. the record id) but resolvedPath.pathname doesn't
                              // and the match would fail.
                              getDecodedPathname(location.pathname)
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

/**
 * Returns the pathname with each segment decoded
 */
const getDecodedPathname = (pathname: string) =>
    pathname.split('/').map(decodeURIComponent).join('/');

const DefaultTabs = <TabbedFormTabs />;
const DefaultComponent = ({ children }) => (
    <CardContent>{children}</CardContent>
);
const DefaultToolbar = <Toolbar />;

export interface TabbedFormViewProps {
    children?: ReactNode;
    className?: string;
    component?: ComponentType<any>;
    resource?: string;
    formRootPathname?: string;
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    toolbar?: ReactElement | false;
    sx?: SxProps;
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
        color: theme.palette.error.main,
    },
}));

const sanitizeRestProps = ({ record, resource, ...rest }: any) => rest;
