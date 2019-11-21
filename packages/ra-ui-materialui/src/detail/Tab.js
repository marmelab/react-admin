import React, { isValidElement } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import MuiTab from '@material-ui/core/Tab';
import { useTranslate } from 'ra-core';
import classnames from 'classnames';

import Labeled from '../input/Labeled';

const sanitizeRestProps = ({
    contentClassName,
    label,
    icon,
    value,
    translate,
    ...rest
}) => rest;

/**
 * Tab element for the SimpleShowLayout.
 *
 * The `<Tab>` component accepts the following props:
 *
 * - label: The string displayed for each tab
 * - icon: The icon to show before the label (optional). Must be a component.
 *
 * @example
 *     // in src/posts.js
 *     import React from 'react';
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
 *                 <Tab label="Metadata" icon={<PersonIcon />}>
 *                     <TextField source="category" />
 *                </Tab>
 *             </TabbedShowLayout>
 *         </Show>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
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
const Tab = ({
    basePath,
    children,
    contentClassName,
    context,
    className,
    icon,
    label,
    record,
    resource,
    value,
    ...rest
}) => {
    const translate = useTranslate();

    const renderHeader = () => (
        <MuiTab
            key={label}
            label={translate(label, { _: label })}
            value={value}
            icon={icon}
            className={classnames('show-tab', className)}
            component={Link}
            to={value}
            {...sanitizeRestProps(rest)}
        />
    );

    const renderContent = () => (
        <span className={contentClassName}>
            {React.Children.map(children, field =>
                field && isValidElement(field) ? (
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
    value: PropTypes.string,
};

export default Tab;
