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
    GetListResult,
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

    const handleClose = () => {
        redirect('/deals');
    };

    const queryClient = useQueryClient();

    const onSuccess = async (deal: Deal) => {
        redirect('/deals');
        // increase the index of all deals in the same stage as the new deal
        const deals = await dataProvider.getList('deals', {
            pagination: { page: 1, perPage: 50 },
            sort: { field: 'id', order: 'ASC' },
            filter: { stage: deal.stage },
        });

        const updatedDeals = await Promise.all(
            deals.data
                .filter(oldDeal => oldDeal.id !== deal.id)
                .map(async oldDeal => {
                    return (
                        await dataProvider.update('deals', {
                            id: oldDeal.id,
                            data: { index: oldDeal.index + 1 },
                            previousData: oldDeal,
                        })
                    ).data;
                })
        );

        const now = Date.now();

        queryClient.setQueriesData<GetListResult | undefined>(
            ['deals', 'getList'],
            res => {
                if (!res) return res;
                return { ...res, data: updatedDeals };
            },
            { updatedAt: now }
        );
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
