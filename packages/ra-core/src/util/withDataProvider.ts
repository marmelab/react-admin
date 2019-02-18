import { connect } from 'react-redux';
import get from 'lodash/get';

import { startUndoable } from '../actions/undoActions';

/**
 * Higher-order component for fetching the dataProvider
 *
 * Injects a dataProvider function prop, which behaves just like
 * the dataProvider function (same signature, returns a Promise), but
 * uses Redux under the hood. The benefit is that react-admin tracks
 * the loading state when using this function, and shows the loader animation
 * while the dataProvider is waiting for a response.
 *
 * In addition to the 3 parameters of the dataProvider function (verb, resource, payload),
 * the injected dataProvider prop accepts a fourth parameter, an object literal
 * which may contain side effects, of make the action optimistic (with undoable: true).
 *
 * As it uses connect() from react-redux, this HOC also injects the dispatch prop,
 * allowing developers to dispatch additional actions upon completion.
 *
 * @example
 *
 * import { withDataProvider, showNotification } from 'react-admin';
 * class PostList extends Component {
 *     state = {
 *         posts: [],
 *     }
 *
 *     componentDidMount() {
 *         const { dataProvider, dispatch } = this.props;
 *         dataProvider('GET_LIST', 'posts', { filter: { status: 'pending' }})
 *            .then(({ data: posts }) => this.setState({ posts }))
 *            .catch(error => dispatch(showNotification(error.message, 'error')))
 *     }
 *
 *     render() {
 *         const { posts } = this.state;
 *         return (
 *            <Fragment>
 *                {posts.map((post, index) => <PostDetail post={post} key={key} />)}
 *            </Fragment>
 *         );
 *     }
 * }
 *
 * PostList.propTypes = {
 *     dataProvider: PropTypes.func.isRequired,
 * };
 *
 * export default withDataProvider(PostList);
 */
export default Component =>
    connect(
        null,
        dispatch => ({
            dataProvider: (
                type,
                resource: string,
                payload: any,
                meta: any = {}
            ) =>
                new Promise((resolve, reject) => {
                    const action = {
                        type: 'CUSTOM_FETCH',
                        payload,
                        meta: {
                            ...meta,
                            resource,
                            fetch: type,
                            onSuccess: {
                                ...get(meta, 'onSuccess', {}),
                                callback: ({ payload: response }) =>
                                    resolve(response),
                            },
                            onFailure: {
                                ...get(meta, 'onFailure', {}),
                                callback: ({ error }) =>
                                    reject(
                                        new Error(
                                            error.message
                                                ? error.message
                                                : error
                                        )
                                    ),
                            },
                        },
                    };

                    return meta.undoable
                        ? dispatch(startUndoable(action))
                        : dispatch(action);
                }),
            dispatch,
        })
    )(Component);
