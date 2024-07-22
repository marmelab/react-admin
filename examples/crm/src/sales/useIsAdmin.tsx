import { useGetIdentity, useGetOne } from 'react-admin';
import { Sale } from '../types';

export function useIsAdmin() {
    const { identity } = useGetIdentity();
    const user = useGetOne<Sale>('sales', { id: identity?.id });
    if (!user?.data) {
        return false;
    }

    return user.data.administrator;
}
