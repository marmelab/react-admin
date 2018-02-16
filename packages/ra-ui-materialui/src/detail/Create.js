import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import classnames from 'classnames';
import { CoreCreate } from 'ra-core';

import Header from '../layout/Header';
import Title from '../layout/Title';
import DefaultActions from './CreateActions';

const sanitizeRestProps = ({
    actions,
    children,
    className,
    crudCreate,
    isLoading,
    resource,
    title,
    hasCreate,
    hasDelete,
    hasEdit,
    hasList,
    hasShow,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    ...rest
}) => rest;

/**
 * Page component for the Create view
 * 
 * The `<Create>` component renders the page title and actions.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Create>` component accepts the following props:
 *
 * - title
 * - actions
 * 
 * Both expect an element for value.
 * 
 * @example     
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Create, SimpleForm, TextInput } from 'react-admin';
 *     
 *     export const PostCreate = (props) => (
 *         <Create {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Create>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *     
 *     import { PostCreate } from './posts';
 *     
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" create={PostCreate} />
 *         </Admin>
 *     );
 *     export default App;
 */

const Create = ({
    actions = <DefaultActions />,
    children,
    className,
    hasDelete,
    hasList,
    hasShow,
    match,
    resource,
    title,
    ...rest
}) => {
    if (!children) return null;

    return (
        <CoreCreate
            {...{
                hasDelete,
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
                redirect,
                save,
                title,
            }) => {
                const titleElement = (
                    <Title
                        title={title}
                        record={record}
                        defaultTitle={defaultTitle}
                    />
                );

                return (
                    <div
                        className={classnames('create-page', className)}
                        {...sanitizeRestProps(rest)}
                    >
                        <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                            <Header
                                title={titleElement}
                                actions={actions}
                                actionProps={{
                                    basePath,
                                    resource,
                                    hasList,
                                }}
                            />
                            {React.cloneElement(children, {
                                save,
                                resource,
                                basePath,
                                record,
                                redirect:
                                    typeof children.props.redirect ===
                                    'undefined'
                                        ? redirect
                                        : children.props.redirect,
                            })}
                        </Card>
                    </div>
                );
            }}
        </CoreCreate>
    );
};

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    record: PropTypes.object,
    hasList: PropTypes.bool,
};

Create.defaultProps = {
    record: {},
};

export default Create;
