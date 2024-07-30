import * as React from 'react';
import {
    ChangeEvent,
    Children,
    cloneElement,
    isValidElement,
    ReactElement,
    ReactNode,
    useState,
} from 'react';
import { ResponsiveStyleValue, SxProps } from '@mui/system';
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
import { Outlet, Routes, Route } from 'react-router-dom';
import {
    RaRecord,
    useRecordContext,
    OptionalRecordContextProvider,
} from 'ra-core';

import {
    TabbedShowLayoutTabs,
    getShowLayoutTabFullPath,
} from './TabbedShowLayoutTabs';
import { Tab } from './Tab';

/**
 * Layout for a Show view showing fields grouped in tabs and laid out in a single column.
 *
 * It pulls the record from the RecordContext. It renders a set of `<Tabs>`,
 * each of which contains a list of record fields in a single-column layout
 * (via Material UI's `<Stack>` component).
 * `<TabbedShowLayout>` delegates the actual rendering of fields to its children,
 * which should be `<TabbedShowLayout.Tab>` components.
 * `<TabbedShowLayout.Tab>` wraps each field inside a `<Labeled>` component to add a label.
 *
 * @example
 * // in src/posts.js
 * import * as React from "react";
 * import { Show, TabbedShowLayout, TextField } from 'react-admin';
 *
 * export const PostShow = () => (
 *     <Show>
 *         <TabbedShowLayout>
 *             <TabbedShowLayout.Tab label="Content">
 *                 <TextField source="title" />
 *                 <TextField source="subtitle" />
 *            </TabbedShowLayout.Tab>
 *             <TabbedShowLayout.Tab label="Metadata">
 *                 <TextField source="category" />
 *            </TabbedShowLayout.Tab>
 *         </TabbedShowLayout>
 *     </Show>
 * );
 *
 * // in src/App.js
 * import * as React from "react";
 * import { Admin, Resource } from 'react-admin';
 *
 * import { PostShow } from './posts';
 *
 * const App = () => (
 *     <Admin dataProvider={...}>
 *         <Resource name="posts" show={PostShow} />
 *     </Admin>
 * );
 *
 * @param {TabbedShowLayoutProps} props
 * @param {string} props.className A className to apply to the page content.
 * @param {ElementType} props.component The component to use as root component (div by default).
 * @param {ReactNode} props.divider An optional divider between each field, passed to `<Stack>`.
 * @param {number} props.spacing The spacing to use between each field, passed to `<Stack>`. Defaults to 1.
 * @param {Object} props.sx Custom style object.
 * @param {boolean} props.syncWithLocation Whether to update the URL when the tab changes. Defaults to true.
 * @param {ElementType} props.tabs A custom component for rendering tabs.
 */
export const TabbedShowLayout = (props: TabbedShowLayoutProps) => {
    const {
        children,
        className,
        spacing,
        divider,
        syncWithLocation = true,
        tabs = DefaultTabs,
        value,
        ...rest
    } = props;
    const record = useRecordContext(props);
    const nonNullChildren = Children.toArray(children).filter(
        child => child !== null
    ) as ReactElement<{
        context?: string;
        spacing?: ResponsiveStyleValue<number | string>;
        divider?: ReactNode;
    }>[];
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: ChangeEvent<{}>, value: any): void => {
        if (!syncWithLocation) {
            setTabValue(value);
        }
    };

    if (!record) {
        return null;
    }

    const renderTabHeaders = () =>
        cloneElement(
            tabs,
            {
                onChange: handleTabChange,
                syncWithLocation,
                value: tabValue,
            },
            nonNullChildren
        );

    return (
        <OptionalRecordContextProvider value={props.record}>
            <Root className={className} {...sanitizeRestProps(rest)}>
                {syncWithLocation ? (
                    <Routes>
                        <Route
                            path="/*"
                            element={
                                <>
                                    {renderTabHeaders()}
                                    <Divider />
                                    <div
                                        className={
                                            TabbedShowLayoutClasses.content
                                        }
                                    >
                                        <Outlet />
                                    </div>
                                </>
                            }
                        >
                            {Children.map(nonNullChildren, (tab, index) =>
                                isValidElement(tab) ? (
                                    <Route
                                        path={getShowLayoutTabFullPath(
                                            tab,
                                            index
                                        )}
                                        element={cloneElement(tab, {
                                            context: 'content',
                                            spacing,
                                            divider,
                                        })}
                                    />
                                ) : null
                            )}
                        </Route>
                    </Routes>
                ) : (
                    <>
                        {renderTabHeaders()}
                        <Divider />
                        <div className={TabbedShowLayoutClasses.content}>
                            {Children.map(nonNullChildren, (tab, index) => {
                                if (
                                    !isValidElement(tab) ||
                                    tabValue !== index
                                ) {
                                    return null;
                                }
                                return cloneElement(tab, {
                                    context: 'content',
                                    spacing,
                                    divider,
                                });
                            })}
                        </div>
                    </>
                )}
            </Root>
        </OptionalRecordContextProvider>
    );
};

TabbedShowLayout.Tab = Tab;

export interface TabbedShowLayoutProps {
    children: ReactNode;
    className?: string;
    divider?: ReactNode;
    record?: RaRecord;
    rootPath?: string;
    spacing?: ResponsiveStyleValue<number | string>;
    sx?: SxProps;
    syncWithLocation?: boolean;
    tabs?: ReactElement;
    value?: any;
}

const DefaultTabs = <TabbedShowLayoutTabs />;

const PREFIX = 'RaTabbedShowLayout';

export const TabbedShowLayoutClasses = {
    content: `${PREFIX}-content`,
};

const Root = styled('div', {
    name: PREFIX,
    overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
    flex: 1,
    [`& .${TabbedShowLayoutClasses.content}`]: {
        padding: `${theme.spacing(1)} ${theme.spacing(2)}`,
    },
}));

const sanitizeRestProps = ({
    record,
    resource,
    initialValues,
    staticContext,
    translate,
    tabs,
    ...rest
}: any) => rest;
