import * as React from 'react';
import { isValidElement, ReactElement, ReactNode } from 'react';
import PropTypes from 'prop-types';
import { Link, useLocation } from 'react-router-dom';
import MuiTab, { TabProps as MuiTabProps } from '@material-ui/core/Tab';
import { useTranslate, Record } from 'ra-core';
import classnames from 'classnames';

import Labeled from '../input/Labeled';

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
 *     import FavoriteIcon from '@material-ui/icons/Favorite';
 *     import PersonPinIcon from '@material-ui/icons/PersonPin';
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
    icon,
    label,
    record,
    resource,
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
        <span className={contentClassName}>
            {React.Children.map(children, field =>
                field && isValidElement<any>(field) ? (
                    <div
                        key={field.props.source}
                        className={classnames(
                            'ra-field',
                            `ra-field-${field.props.source}`,
                            field.props.className
                        )}
                    >
                        {field.props.addLabel ? (
                            <Labeled
                                label={field.props.label}
                                source={field.props.source}
                                fullWidth={field.props.fullWidth}
                                basePath={basePath}
                                record={record}
                                resource={resource}
                            >
                                {field}
                            </Labeled>
                        ) : typeof field.type === 'string' ? (
                            field
                        ) : (
                            React.cloneElement(field, {
                                basePath,
                                record,
                                resource,
                            })
                        )}
                    </div>
                ) : null
            )}
        </span>
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
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export interface TabProps extends MuiTabProps {
    basePath?: string;
    children: ReactNode;
    contentClassName?: string;
    context?: 'header' | 'content';
    className?: string;
    icon?: ReactElement;
    label: string;
    path?: string;
    record?: Record;
    resource?: string;
    syncWithLocation?: boolean;
    value?: string | number;
}
