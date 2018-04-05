import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import classnames from 'classnames';
import { CreateController } from 'ra-core';

import Header from '../layout/Header';
import DefaultActions from './CreateActions';
import RecordTitle from '../layout/RecordTitle';

const sanitizeRestProps = ({
    actions,
    children,
    className,
    crudCreate,
    isLoading,
    resource,
    title,
    hasCreate,
    hasEdit,
    hasList,
    hasShow,
    match,
    location,
    history,
    options,
    locale,
    permissions,
    translate,
    ...rest
}) => rest;

const CreateView = ({
    actions = <DefaultActions />,
    basePath,
    children,
    className,
    defaultTitle,
    hasList,
    hasShow,
    record = {},
    redirect,
    resource,
    save,
    title,
    ...rest
}) => (
    <div
        className={classnames('create-page', className)}
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
                    typeof children.props.redirect === 'undefined'
                        ? redirect
                        : children.props.redirect,
            })}
        </Card>
    </div>
);

CreateView.propTypes = {
    actions: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.element,
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: PropTypes.any,
};

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
const Create = props => (
    <CreateController {...props}>
        {controllerProps => <CreateView {...props} {...controllerProps} />}
    </CreateController>
);

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    location: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    record: PropTypes.object,
    hasList: PropTypes.bool,
};

export default Create;
