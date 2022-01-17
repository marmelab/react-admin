import * as React from 'react';
import { isValidElement, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import { Tab as MuiTab, TabProps as MuiTabProps, Stack } from '@mui/material';
import { ResponsiveStyleValue } from '@mui/system';
import { useTranslate, RaRecord } from 'ra-core';
import classnames from 'classnames';

import { FieldWithLabel } from './FieldWithLabel';

/**
 * Tab element for the TabbedShowLayout.
 *
 * The `<Tab>` component accepts the following props:
 *
 * - label: The string displayed for each tab
 * - icon: The icon to show before the label (optional). Must be a component.
 * - path: The string used for custom urls
 *
 * @example
 *     // in src/posts.js
 *     import * as React from "react";
 *     import FavoriteIcon from '@mui/icons-material/Favorite';
 *     import PersonPinIcon from '@mui/icons-material/PersonPin';
 *     import { Show, TabbedShowLayout, Tab, TextField } from 'react-admin';
 *
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <TabbedShowLayout>
 *                 <Tab label="Content" icon={<FavoriteIcon />}>
 *                     <TextField source="title" />
 *                     <TextField source="subtitle" />
 *                </Tab>
 *                 <Tab label="Metadata" icon={<PersonIcon />} path="metadata">
 *                     <TextField source="category" />
 *                </Tab>
 *             </TabbedShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import * as React from "react";
 *     import { Admin, Resource } from 'react-admin';
 *
 *     import { PostShow } from './posts';
 *
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" show={PostShow} />
 *         </Admin>
 *     );
 *     export default App;
 */
export const Tab = ({
    basePath,
    children,
    contentClassName,
    context,
    className,
    divider,
    icon,
    label,
    record,
    spacing = 1,
    syncWithLocation = true,
    value,
    ...rest
}: TabProps) => {
    const translate = useTranslate();
    const location = useLocation();
    const propsForLink = {
        component: Link,
        to: { ...location, pathname: value },
    };

    const renderHeader = () => (
        <MuiTab
            key={label}
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('show-tab', className)}
            {...(syncWithLocation ? propsForLink : {})} // to avoid TypeScript screams, see https://github.com/mui-org/material-ui/issues/9106#issuecomment-451270521
            {...rest}
        />
    );

    const renderContent = () => (
        <Stack className={contentClassName} spacing={spacing} divider={divider}>
            {React.Children.map(children, field =>
                field && isValidElement<any>(field) ? (
                    <FieldWithLabel
                        key={field.props.source}
                        className={classnames(
                            'ra-field',
                            field.props.source &&
                                `ra-field-${field.props.source}`,
                            field.props.className
                        )}
                    >
                        {field}
                    </FieldWithLabel>
                ) : null
            )}
        </Stack>
    );

    return context === 'header' ? renderHeader() : renderContent();
};

Tab.propTypes = {
    className: PropTypes.string,
    contentClassName: PropTypes.string,
    children: PropTypes.node,
    context: PropTypes.oneOf(['header', 'content']),
    icon: PropTypes.element,
    label: PropTypes.string.isRequired,
    path: PropTypes.string,
    spacing: PropTypes.any,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export interface TabProps extends Omit<MuiTabProps, 'children'> {
    basePath?: string;
    children: ReactNode;
    contentClassName?: string;
    context?: 'header' | 'content';
    className?: string;
    divider?: ReactNode;
    icon?: ReactElement;
    label: string;
    path?: string;
    record?: RaRecord;
    spacing?: ResponsiveStyleValue<number | string>;
    syncWithLocation?: boolean;
    value?: string | number;
}
