import { useCallback } from 'react';
import { useQueryClient } from 'react-query';

/**
 * Get a callback to force a refetch of the current user identity
 *
 * @example
 * const IdentityForm = () => {
 *     const { isLoading, error, identity } = useGetIdentity();
 *     const [newIdentity, setNewIdentity] = useState('');
 *     const refresh = useRefreshIdentity();
 *     const handleSubmit = (e) => {
 *         e.preventDefault();
 *         if (!newIdentity) return;
 *         fetch('/update_identity', {
 *             method: 'POST',
 *             headers: { 'Content-Type': 'application/json' },
 *             body: JSON.stringify({ identity: newIdentity })
 *         }).then(refresh);
 *     };
 *     if (isLoading) return <>Loading</>;
 *     if (error) return <>Error</>;
 *     return (
 *         <form onSubmit={handleSubmit}>
 *             <input defaultValue={identity.fullName} onChange={e => setNewIdentity(e.target.value)} />
 *             <input type="submit" value="Save" />
 *         </form>
 *     );
 * };
 */
export const useRefreshIdentity = () => {
    const queryClient = useQueryClient();
    return useCallback(() => {
        queryClient.invalidateQueries(['auth', 'getIdentity']);
    }, [queryClient]);
};
