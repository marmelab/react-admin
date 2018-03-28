import React from 'react';
import PropTypes from 'prop-types';
import Card from 'material-ui/Card';
import classnames from 'classnames';
import shallowEqual from 'recompose/shallowEqual';
import pick from 'lodash/pick';

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

class CreateView extends React.Component {
    state = {
        children: null,
    };
    componentWillMount() {
        this.setupChildren(this.props);
    }
    componentWillReceiveProps({ memoizeProps, ...nextProps }) {
        if (
            !memoizeProps ||
            !shallowEqual(
                pick(this.props, memoizeProps),
                pick(this.props, nextProps)
            )
        ) {
            this.setupChildren(nextProps);
        }
    }

    setupChildren = ({ children, ...props }) => {
        this.setState({
            children:
                typeof children === 'function' ? children(props) : children,
        });
    };

    render() {
        const {
            actions = <DefaultActions />,
            basePath,
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
        } = this.props;
        const { children } = this.state;
        return (
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
    }
}

CreateView.propTypes = {
    actions: PropTypes.element,
    basePath: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    memoizeProps: PropTypes.arrayOf(PropTypes.string),
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
