import React from 'react';
import PropTypes from 'prop-types';
import Card, { CardContent } from 'material-ui/Card';
import classnames from 'classnames';
import { CoreEdit } from 'react-admin-core';

import Header from '../layout/Header';
import Title from '../layout/Title';
import DefaultActions from './EditActions';

const sanitizeRestProps = ({
    actions,
    children,
    className,
    crudGetOne,
    crudUpdate,
    data,
    hasCreate,
    hasDelete,
    hasEdit,
    hasList,
    hasShow,
    id,
    isLoading,
    resetForm,
    resource,
    title,
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
 * Page component for the Edit view
 * 
 * The `<Edit>` component renders the page title and actions,
 * fetches the record from the data provider.
 * It is not responsible for rendering the actual form -
 * that's the job of its child component (usually `<SimpleForm>`),
 * to which it passes pass the `record` as prop.
 *
 * The `<Edit>` component accepts the following props:
 *
 * - title
 * - actions
 * 
 * Both expect an element for value.
 * 
 * @example     
 *     // in src/posts.js
 *     import React from 'react';
 *     import { Edit, SimpleForm, TextInput } from 'react-admin';
 *     
 *     export const PostEdit = (props) => (
 *         <Edit {...props}>
 *             <SimpleForm>
 *                 <TextInput source="title" />
 *             </SimpleForm>
 *         </Edit>
 *     );
 *
 *     // in src/App.js
 *     import React from 'react';
 *     import { Admin, Resource } from 'react-admin';
 *     
 *     import { PostEdit } from './posts';
 *     
 *     const App = () => (
 *         <Admin dataProvider={...}>
 *             <Resource name="posts" edit={PostEdit} />
 *         </Admin>
 *     );
 *     export default App;
 */
const Edit = ({
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
        <CoreEdit
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
                version,
            }) => {
                const titleElement = record ? (
                    <Title
                        title={title}
                        record={record}
                        defaultTitle={defaultTitle}
                    />
                ) : (
                    ''
                );

                return (
                    <div
                        className={classnames('edit-page', className)}
                        {...sanitizeRestProps(rest)}
                    >
                        <Card style={{ opacity: isLoading ? 0.8 : 1 }}>
                            <Header
                                title={titleElement}
                                actions={actions}
                                actionProps={{
                                    basePath,
                                    record,
                                    hasDelete,
                                    hasShow,
                                    hasList,
                                    resource,
                                }}
                            />
                            {record ? (
                                React.cloneElement(children, {
                                    save,
                                    resource,
                                    basePath,
                                    record,
                                    version,
                                    redirect:
                                        typeof children.props.redirect ===
                                        'undefined'
                                            ? redirect
                                            : children.props.redirect,
                                })
                            ) : (
                                <CardContent>&nbsp;</CardContent>
                            )}
                        </Card>
                    </div>
                );
            }}
        </CoreEdit>
    );
};

Edit.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasDelete: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
};

export default Edit;
