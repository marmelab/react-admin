import React from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import classnames from 'classnames';
import { EditController } from 'ra-core';

import Header from '../layout/Header';
import DefaultActions from './EditActions';
import RecordTitle from '../layout/RecordTitle';

const sanitizeRestProps = ({
    actions,
    children,
    className,
    crudGetOne,
    crudUpdate,
    data,
    hasCreate,
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
    undoable,
    ...rest
}) => rest;

export const EditView = ({
    actions = <DefaultActions />,
    basePath,
    children,
    className,
    defaultTitle,
    formName,
    hasList,
    hasShow,
    record,
    redirect,
    resource,
    save,
    title,
    version,
    ...rest
}) => (
    <div
        className={classnames('edit-page', className)}
        {...sanitizeRestProps(rest)}
    >
        <Card>
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
                    hasShow,
                    hasList,
                    resource,
                }}
            />
            {record ? (
                React.cloneElement(children, {
                    basePath,
                    form: formName,
                    record,
                    redirect:
                        typeof children.props.redirect === 'undefined'
                            ? redirect
                            : children.props.redirect,
                    resource,
                    save,
                    version,
                })
            ) : (
                <CardContent>&nbsp;</CardContent>
            )}
        </Card>
    </div>
);

EditView.propTypes = {
    actions: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    formName: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: PropTypes.any,
    version: PropTypes.number,
};

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
const Edit = props => (
    <EditController {...props}>
        {controllerProps => <EditView {...props} {...controllerProps} />}
    </EditController>
);

Edit.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.node,
    className: PropTypes.string,
    formName: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    id: PropTypes.any.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
};

export default Edit;
