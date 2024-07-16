import * as React from 'react';
import {
    Create,
    SimpleForm,
    useRedirect,
    useDataProvider,
    useGetIdentity,
    useListContext,
    GetListResult,
} from 'react-admin';
import { Dialog } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { Deal } from '../types';
import { DealForm } from './DealForm';

export const DealCreate = ({ open }: { open: boolean }) => {
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const { data: allDeals } = useListContext<Deal>();

    const handleClose = () => {
        redirect('/deals');
    };

    const queryClient = useQueryClient();

    const onSuccess = async (deal: Deal) => {
        if (!allDeals) {
            redirect('/deals');
            return;
        }
        // increase the index of all deals in the same stage as the new deal
        // first, get the list of deals in the same stage
        const deals = allDeals.filter(
            (d: Deal) => d.stage === deal.stage && d.id !== deal.id
        );
        // update the actual deals in the database
        await Promise.all(
            deals.map(async oldDeal =>
                dataProvider.update('deals', {
                    id: oldDeal.id,
                    data: { index: oldDeal.index + 1 },
                    previousData: oldDeal,
                })
            )
        );
        // refresh the list of deals in the cache as we used dataProvider.update(),
        // which does not update the cache
        const dealsById = deals.reduce(
            (acc, d) => ({
                ...acc,
                [d.id]: { ...d, index: d.index + 1 },
            }),
            {} as { [key: string]: Deal }
        );
        const now = Date.now();
        queryClient.setQueriesData<GetListResult | undefined>(
            { queryKey: ['deals', 'getList'] },
            res => {
                if (!res) return res;
                return {
                    ...res,
                    data: res.data.map((d: Deal) => dealsById[d.id] || d),
                };
            },
            { updatedAt: now }
        );
        redirect('/deals');
    };

    const { identity } = useGetIdentity();

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="lg">
            <Create<Deal>
                resource="deals"
                mutationOptions={{ onSuccess }}
                sx={{ '& .RaCreate-main': { mt: 0 } }}
            >
                <SimpleForm
                    defaultValues={{
                        sales_id: identity?.id,
                        contact_ids: [],
                        index: 0,
                    }}
                >
                    <DealForm />
                </SimpleForm>
            </Create>
        </Dialog>
    );
};
