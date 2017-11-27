import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Card from 'material-ui/Card';
import compose from 'recompose/compose';
import inflection from 'inflection';
import Header from '../layout/Header';
import Title from '../layout/Title';
import { crudCreate as crudCreateAction } from '../../actions/dataActions';
import DefaultActions from './CreateActions';
import translate from '../../i18n/translate';
import withChildrenAsFunction from '../withChildrenAsFunction';

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
class Create extends Component {
    getBasePath() {
        const { location } = this.props;
        return location.pathname
            .split('/')
            .slice(0, -1)
            .join('/');
    }

    defaultRedirectRoute() {
        const { hasShow, hasEdit } = this.props;
        if (hasEdit) return 'edit';
        if (hasShow) return 'show';
        return 'list';
    }

    save = (record, redirect) => {
        this.props.crudCreate(
            this.props.resource,
            record,
            this.getBasePath(),
            redirect
        );
    };

    render() {
        const {
            actions = <DefaultActions />,
            children,
            isLoading,
            resource,
            title,
            translate,
            hasList,
        } = this.props;

        if (!children) return null;
        const basePath = this.getBasePath();

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.create', {
            name: `${resourceName}`,
        });
        const titleElement = (
            <Title title={title} defaultTitle={defaultTitle} />
        );

        return (
            <div className="create-page">
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
                        save: this.save,
                        resource,
                        basePath,
                        record: {},
                        translate,
                        redirect:
                            typeof children.props.redirect === 'undefined'
                                ? this.defaultRedirectRoute()
                                : children.props.redirect,
                    })}
                </Card>
            </div>
        );
    }
}

Create.propTypes = {
    actions: PropTypes.element,
    children: PropTypes.element,
    crudCreate: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    location: PropTypes.object.isRequired,
    resource: PropTypes.string.isRequired,
    title: PropTypes.any,
    translate: PropTypes.func.isRequired,
    hasList: PropTypes.bool,
};

Create.defaultProps = {
    data: {},
};

function mapStateToProps(state) {
    return {
        isLoading: state.admin.loading > 0,
    };
}

const enhance = compose(
    connect(mapStateToProps, { crudCreate: crudCreateAction }),
    translate,
    withChildrenAsFunction
);

export default enhance(Create);
