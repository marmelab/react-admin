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
 * - mount: { isLoading: true }
 * - success: { identity: Identity, isLoading: false }
 * - error: { error: Error, isLoading: false }
 *
 * The implementation is left to the authProvider.
 *
 * @returns The current user identity. Destructure as { identity, error, isLoading }.
 *
 * @example
 *
 * import { useGetIdentity, useGetOne } from 'react-admin';
 *
 * const PostDetail = ({ id }) => {
 *     const { data: post, isLoading: postLoading } = useGetOne('posts', { id });
 *     const { identity, isLoading: identityLoading } = useGetIdentity();
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
        isLoading: true,
    });
    const authProvider = useAuthProvider();
    useEffect(() => {
        if (authProvider && typeof authProvider.getIdentity === 'function') {
            const callAuthProvider = async () => {
                try {
                    const identity = await authProvider.getIdentity();
                    setState({
                        isLoading: false,
                        identity: identity || defaultIdentity,
                    });
                } catch (error) {
                    setState({
                        isLoading: false,
                        error,
                    });
                }
            };
            callAuthProvider();
        } else {
            setState({
                isLoading: false,
                identity: defaultIdentity,
            });
        }
    }, [authProvider, setState]);
    return state;
};

interface State {
    isLoading: boolean;
    identity?: UserIdentity;
    error?: any;
}

export default useGetIdentity;
