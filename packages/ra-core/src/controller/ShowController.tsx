import { Component, ReactNode, ComponentType } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import inflection from 'inflection';
import withTranslate from '../i18n/translate';
import { crudGetOne as crudGetOneAction } from '../actions';
import checkMinimumRequiredProps from './checkMinimumRequiredProps';
import { Translate, Record, Dispatch, Identifier } from '../types';

interface ChildrenFuncParams {
    isLoading: boolean;
    defaultTitle: string;
    resource: string;
    basePath: string;
    record?: Record;
    translate: Translate;
    version: number;
}

interface Props {
    basePath: string;
    children: (params: ChildrenFuncParams) => ReactNode;
    hasCreate?: boolean;
    hasEdit?: boolean;
    hasShow?: boolean;
    hasList?: boolean;
    isLoading: boolean;
    resource: string;
}

interface EnhancedProps {
    crudGetOne: Dispatch<typeof crudGetOneAction>;
    id: Identifier;
    record?: Record;
    translate: Translate;
    version: number;
}

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
export class UnconnectedShowController extends Component<
    Props & EnhancedProps
> {
    componentDidMount() {
        this.updateData();
    }

    componentWillReceiveProps(nextProps: Props & EnhancedProps) {
        if (
            this.props.id !== nextProps.id ||
            nextProps.version !== this.props.version
        ) {
            this.updateData(nextProps.resource, nextProps.id);
        }
    }

    updateData(resource = this.props.resource, id = this.props.id) {
        this.props.crudGetOne(resource, id, this.props.basePath);
    }

    render() {
        const {
            basePath,
            children,
            id,
            isLoading,
            record,
            resource,
            translate,
            version,
        } = this.props;

        if (!children) {
            return null;
        }

        const resourceName = translate(`resources.${resource}.name`, {
            smart_count: 1,
            _: inflection.humanize(inflection.singularize(resource)),
        });
        const defaultTitle = translate('ra.page.show', {
            name: `${resourceName}`,
            id,
            record,
        });
        return children({
            isLoading,
            defaultTitle,
            resource,
            basePath,
            record,
            translate,
            version,
        });
    }
}

function mapStateToProps(state, props) {
    return {
        id: props.id,
        record: state.admin.resources[props.resource]
            ? state.admin.resources[props.resource].data[props.id]
            : null,
        isLoading: state.admin.loading > 0,
        version: state.admin.ui.viewVersion,
    };
}

const ShowController = compose(
    checkMinimumRequiredProps('Show', ['basePath', 'resource']),
    connect(
        mapStateToProps,
        { crudGetOne: crudGetOneAction }
    ),
    withTranslate
)(UnconnectedShowController);

export default ShowController as ComponentType<Props>;
