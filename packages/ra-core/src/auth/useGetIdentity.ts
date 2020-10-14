import { useEffect } from 'react';
import useAuthProvider from './useAuthProvider';
import { UserIdentity } from '../types';
import { useSafeSetState } from '../util/hooks';

const defaultIdentity = {
    id: '',
    fullName: null,
};

/**
 * Return the current user identity by calling authProvider.getIdentity() on mount
 *
 * The return value updates according to the call state:
 *
 * - mount: { loading: true, loaded: false }
 * - success: { identity: Identity, loading: false, loaded: true }
 * - error: { error: Error, loading: false, loaded: true }
 *
 * The implementation is left to the authProvider.
 *
 * @returns The current user identity. Destructure as { identity, error, loading, loaded }.
 *
 * @example
 *
 * import { useGetIdentity, useGetOne } from 'react-admin';
 *
 * const PostDetail = ({ id }) => {
 *     const { data: post, loading: postLoading } = useGetOne('posts', id);
 *     const { identity, loading: identityLoading } = useGetIdentity();
 *     if (postLoading || identityLoading) return <>Loading...</>;
 *     if (!post.lockedBy || post.lockedBy === identity.id) {
 *         // post isn't locked, or is locked by me
 *         return <PostEdit post={post} />
 *     } else {
 *         // post is locked by someone else and cannot be edited
 *         return <PostShow post={post} />
 *     }
 * }
 */
const useGetIdentity = () => {
    const [state, setState] = useSafeSetState<State>({
        loading: true,
        loaded: false,
    });
    const authProvider = useAuthProvider();
    useEffect(() => {
        if (authProvider && typeof authProvider.getIdentity === 'function') {
            const callAuthProvider = async () => {
                try {
                    const identity = await authProvider.getIdentity();
                    setState({
                        loading: false,
                        loaded: true,
                        identity: identity || defaultIdentity,
                    });
                } catch (error) {
                    setState({
                        loading: false,
                        loaded: true,
                        error,
                    });
                }
            };
            callAuthProvider();
        } else {
            // fallback for pre-3.9 authProviders, which had no getIdentity method
            // FIXME to be removed for the next major
            setState({
                loading: false,
                loaded: true,
                identity: defaultIdentity,
            });
        }
    }, [authProvider, setState]);
    return state;
};

interface State {
    loading: boolean;
    loaded: boolean;
    identity?: UserIdentity;
    error?: any;
}

export default useGetIdentity;
