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
import PropTypes from 'prop-types';
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
import {
    FormRenderProps,
    MutationMode,
    RaRecord,
    useResourceContext,
} from 'ra-core';
import { Toolbar } from './Toolbar';
import { TabbedFormTabs, getTabbedFormTabFullPath } from './TabbedFormTabs';

export const TabbedFormView = (props: TabbedFormViewProps): ReactElement => {
    const {
        children,
        className,
        component: Component = DefaultComponent,
        formRootPathname,
        handleSubmit,
        mutationMode,
        record,
        saving,
        submitOnEnter = true,
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
            onSubmit={handleSubmit}
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
                              location.pathname
                          )
                        : tabValue !== index;

                    return isValidElement<any>(tab)
                        ? React.cloneElement(tab, {
                              intent: 'content',
                              resource,
                              record,
                              hidden,
                              value: syncWithLocation ? tabPath : index,
                          })
                        : null;
                })}
            </Component>
            {toolbar &&
                cloneElement(toolbar, {
                    className: 'toolbar',
                    mutationMode,
                    record,
                    resource,
                    saving,
                    submitOnEnter,
                })}
        </Root>
    );
};

TabbedFormView.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.func]), // @deprecated
    defaultValues: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
    invalid: PropTypes.bool,
    location: PropTypes.object,
    match: PropTypes.object,
    mutationMode: PropTypes.oneOf(['pessimistic', 'optimistic', 'undoable']),
    pristine: PropTypes.bool,
    // @ts-ignore
    record: PropTypes.object,
    resource: PropTypes.string,
    saving: PropTypes.bool,
    submitOnEnter: PropTypes.bool,
    tabs: PropTypes.element,
    toolbar: PropTypes.element,
    translate: PropTypes.func,
    validate: PropTypes.func,
    value: PropTypes.number,
};

const DefaultTabs = <TabbedFormTabs />;
const DefaultComponent = ({ children }) => (
    <CardContent>{children}</CardContent>
);
const DefaultToolbar = <Toolbar />;

export interface TabbedFormViewProps extends FormRenderProps {
    children?: ReactNode;
    className?: string;
    component?: ComponentType<any>;
    mutationMode?: MutationMode;
    record?: Partial<RaRecord>;
    resource?: string;
    formRootPathname?: string;
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    toolbar?: ReactElement;
    submitOnEnter?: boolean;
    sx?: SxProps;
}

const sanitizeRestProps = ({ save = null, ...props }) => props;

const PREFIX = 'RaTabbedForm';

export const TabbedFormClasses = {
    errorTabButton: `${PREFIX}-errorTabButton`,
};

const Root = styled('form', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    [`& .MuiTab-root.${TabbedFormClasses.errorTabButton}`]: {
        color: theme.palette.error.main,
    },
}));
