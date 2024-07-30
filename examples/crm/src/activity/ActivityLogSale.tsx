import { useGetIdentity } from 'react-admin';
import { Sale } from '../types';

export const ActivityLogSale = ({ sale }: { sale: Sale }) => {
    const { identity, isPending } = useGetIdentity();
    if (isPending) return null;
    return sale.id === identity?.id
        ? 'You'
        : `${sale.first_name} ${sale.last_name}`;
};
