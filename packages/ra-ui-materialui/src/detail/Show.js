import React, { cloneElement, Children } from 'react';
import PropTypes from 'prop-types';
import Card from '@material-ui/core/Card';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { ShowController, ComponentPropType } from 'ra-core';

import DefaultActions from './ShowActions';
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
    title,
    children,
    className,
    crudGetOne,
    id,
    data,
    isLoading,
    resource,
    hasCreate,
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

export const ShowView = withStyles(styles)(
    ({
        actions: Actions,
        aside: Aside,
        basePath,
        children,
        classes,
        className,
        defaultTitle,
        hasEdit,
        hasList,
        isLoading,
        record,
        resource,
        title,
        version,
        ...rest
    }) => {
        if (typeof Actions === 'undefined' && hasEdit) {
            Actions = DefaultActions;
        }
        if (!children) {
            return null;
        }
        return (
            <div
                className={classnames('show-page', classes.root, className)}
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
                        hasEdit={hasEdit}
                        resource={resource}
                    />
                }
                <div
                    className={classnames(classes.main, {
                        [classes.noActions]: !Actions,
                    })}
                >
                    <Card className={classes.card}>
                        {record &&
                            cloneElement(Children.only(children), {
                                resource,
                                basePath,
                                record,
                                version,
                            })}
                    </Card>
                    {Aside &&
                        <Aside
                            basePath={basePath}
                            record={record}
                            resource={resource}
                            version={version}
                        />
                    }
                </div>
            </div>
        );
    }
);

ShowView.propTypes = {
    actions: ComponentPropType,
    aside: ComponentPropType,
    basePath: PropTypes.string,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    defaultTitle: PropTypes.any,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    isLoading: PropTypes.bool,
    record: PropTypes.object,
    resource: PropTypes.string,
    title: PropTypes.any,
    version: TitlePropType,
};

ShowView.defaultProps = {
    classes: {},
};

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
const Show = props => (
    <ShowController {...props}>
        {controllerProps => <ShowView {...props} {...controllerProps} />}
    </ShowController>
);

Show.propTypes = {
    actions: ComponentPropType,
    aside: ComponentPropType,
    children: PropTypes.element,
    classes: PropTypes.object,
    className: PropTypes.string,
    hasCreate: PropTypes.bool,
    hasEdit: PropTypes.bool,
    hasList: PropTypes.bool,
    hasShow: PropTypes.bool,
    id: PropTypes.any.isRequired,
    resource: PropTypes.string.isRequired,
    title: TitlePropType,
};

export default Show;
