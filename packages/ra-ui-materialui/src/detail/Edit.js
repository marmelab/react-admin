import React, { Children, cloneElement } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { EditController, ComponentPropType } from 'ra-core';

import DefaultActions from './EditActions';
import TitleForRecord from '../layout/TitleForRecord';
import { TitlePropType } from '../layout';

export const styles = createStyles({
    root: {},
    main: {
        display: 'flex',
    },
    noActions: {
        marginTop: '1em',
    },
    card: {
        flex: '1 1 auto',
    },
});

const sanitizeRestProps = ({
    actions,
    aside,
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

export const EditView = withStyles(styles)(
    ({
        actions: Actions,
        aside: Aside,
        basePath,
        children,
        classes,
        className,
        defaultTitle,
        hasList,
        hasShow,
        record,
        redirect,
        resource,
        save,
        title,
        undoable,
        version,
        ...rest
    }) => {
        if (typeof Actions === 'undefined' && hasShow) {
            Actions = DefaultActions;
        }
        if (!children) {
            return null;
        }
        return (
            <div
                className={classnames('edit-page', classes.root, className)}
                {...sanitizeRestProps(rest)}
            >
                <TitleForRecord
                    title={title}
                    record={record}
                    defaultTitle={defaultTitle}
                />
                {Actions &&
                    <Actions
                        basePath={basePath}
                        data={record}
                        hasList={hasList}
                        hasShow={hasShow}
                        resource={resource}
                    />
                }
                <div
                    className={classnames(classes.main, {
                        [classes.noActions]: !Actions,
                    })}
                >
                    <Card className={classes.card}>
                        {record ? (
                            cloneElement(Children.only(children), {
                                basePath,
                                record,
                                redirect:
                                    typeof children.props.redirect ===
                                    'undefined'
                                        ? redirect
                                        : children.props.redirect,
                                resource,
                                save,
                                undoable,
                                version,
                            })
                        ) : (
                            <CardContent>&nbsp;</CardContent>
                        )}
                    </Card>
                    {Aside &&
                        <Aside
                            basePath={basePath}
                            record={record}
                            resource={resource}
                            version={version}
                            save={save}
                        />
                    }
                </div>
            </div>
        );
    }
);

EditView.propTypes = {
    actions: ComponentPropType,
    aside: ComponentPropType,
    basePath: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    record: PropTypes.object,
    redirect: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    resource: PropTypes.string,
    save: PropTypes.func,
    title: TitlePropType,
    version: PropTypes.number,
};

EditView.defaultProps = {
    classes: {},
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
    actions: ComponentPropType,
    aside: ComponentPropType,
    children: PropTypes.node,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasShow: PropTypes.bool,
    hasList: PropTypes.bool,
    id: PropTypes.any.isRequired,
    resource: PropTypes.string.isRequired,
    title: TitlePropType,
};

export default Edit;
