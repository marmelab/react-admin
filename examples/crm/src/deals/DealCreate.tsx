import * as React from 'react';
import {
    Create,
    SimpleForm,
    TextInput,
    SelectInput,
    NumberInput,
    ReferenceInput,
    AutocompleteInput,
    required,
    useRedirect,
    useDataProvider,
    useGetIdentity,
    useListContext,
    GetListResult,
    DateInput,
} from 'react-admin';
import { Dialog } from '@mui/material';
import { useQueryClient } from 'react-query';
import { stageChoices } from './stages';
import { typeChoices } from './types';
import { Deal } from '../types';

const validateRequired = required();

export const DealCreate = ({ open }: { open: boolean }) => {
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const { data: allDeals } = useListContext<Deal>();

    const handleClose = () => {
        redirect('/deals');
    };

    const queryClient = useQueryClient();

    const onSuccess = async (deal: Deal) => {
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
            ['deals', 'getList'],
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
        <Dialog open={open} onClose={handleClose}>
            <Create<Deal>
                resource="deals"
                mutationOptions={{ onSuccess }}
                sx={{ width: 500, '& .RaCreate-main': { mt: 0 } }}
            >
                <SimpleForm
                    defaultValues={{
                        index: 0,
                        sales_id: identity && identity?.id,
                    }}
                >
                    <TextInput
                        source="name"
                        label="Deal name"
                        fullWidth
                        validate={validateRequired}
                    />
                    <TextInput
                        source="description"
                        multiline
                        rows={3}
                        fullWidth
                    />
                    <ReferenceInput source="company_id" reference="companies">
                        <AutocompleteInput
                            optionText="name"
                            fullWidth
                            validate={validateRequired}
                        />
                    </ReferenceInput>
                    <DateInput
                        source="start_at"
                        defaultValue={new Date()}
                        fullWidth
                    />
                    <SelectInput
                        source="stage"
                        choices={stageChoices}
                        fullWidth
                        validate={validateRequired}
                        defaultValue="opportunity"
                    />
                    <SelectInput
                        source="type"
                        choices={typeChoices}
                        fullWidth
                    />
                    <NumberInput source="amount" fullWidth defaultValue={0} />
                </SimpleForm>
            </Create>
        </Dialog>
    );
};
