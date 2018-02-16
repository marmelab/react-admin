import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import classnames from 'classnames';
import { CoreShow } from 'ra-core';

import Header from '../layout/Header';
import DefaultActions from './ShowActions';
import RecordTitle from '../layout/RecordTitle';

const sanitizeRestProps = ({
    actions,
    title,
    children,
    className,
    crudGetOne,
    id,
    data,
    isLoading,
    resource,
    hasCreate,
    hasDelete,
    hasEdit,
    hasList,
    hasShow,
    translate,
    version,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    ...rest
}) => rest;

/**
 * Page component for the Show view
 * 
 * The `<Show>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleShowLayout>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Show>` component accepts the following props:
 *
 * - title
 * - actions
 * 
 * Both expect an element for value.
 * 
 * @example     
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Show, SimpleShowLayout, TextField } from 'react-admin';
 *     
 *     export const PostShow = (props) => (
 *         <Show {...props}>
 *             <SimpleShowLayout>
 *                 <TextField source="title" />
 *             </SimpleShowLayout>
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
const Show = ({
    actions = <DefaultActions />,
    children,
    className,
    hasDelete,
    hasEdit,
    hasList,
    location,
    match,
    resource,
    ...rest
}) => {
    if (!children) return null;

    return (
        <CoreShow
            {...{
                hasDelete,
                hasEdit,
                hasList,
                location,
                match,
                resource,
            }}
        >
            {({
                basePath,
                defaultTitle,
                isLoading,
                record,
                title,
                version,
            }) => (
                <div
                    className={classnames('show-page', className)}
                    {...sanitizeRestProps(rest)}
                >
                    <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                        <Header
                            title={
                                <RecordTitle
                                    title={title}
                                    record={record}
                                    defaultTitle={defaultTitle}
                                />
                            }
                            actions={actions}
                            actionProps={{
                                basePath,
                                data: record,
                                hasList,
                                hasDelete,
                                hasEdit,
                                resource,
                            }}
                        />
                        {record &&
                            React.cloneElement(children, {
                                resource,
                                basePath,
                                record,
                                version,
                            })}
                    </Card>
                </div>
            )}
        </CoreShow>
    );
};

Show.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
};

export default Show;
