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
    AutocompleteArrayInput,
    ReferenceArrayInput,
    useRecordContext,
} from 'react-admin';
import { Dialog, Stack } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { stageChoices } from './stages';
import { typeChoices } from './types';
import { Contact, Deal } from '../types';
import { Avatar } from '../contacts/Avatar';

const validateRequired = required();

const dateInPresentOrFuture = (value: string) => {
    const valueDate = new Date(value).setHours(0, 0, 0, 0);
    const presentDate = new Date().setHours(0, 0, 0, 0);
    if (valueDate < presentDate) {
        return 'The date must be in the present or the future';
    }
    return undefined;
};

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
                        index: 0,
                        sales_id: identity && identity?.id,
                        start_at: new Date().toISOString(),
                        contact_ids: [],
                    }}
                >
                    <TextInput
                        source="name"
                        label="Deal name"
                        validate={validateRequired}
                    />
                    <TextInput source="description" multiline rows={3} />
                    <ReferenceInput source="company_id" reference="companies">
                        <AutocompleteInput
                            optionText="name"
                            validate={validateRequired}
                        />
                    </ReferenceInput>

                    <ReferenceArrayInput
                        source="contact_ids"
                        reference="contacts"
                    >
                        <AutocompleteArrayInput
                            optionText={contactOptionText}
                            inputText={contactInputText}
                        />
                    </ReferenceArrayInput>

                    <SelectInput
                        source="stage"
                        choices={stageChoices}
                        validate={validateRequired}
                        defaultValue="opportunity"
                    />
                    <SelectInput
                        source="type"
                        label="Category"
                        choices={typeChoices}
                    />
                    <NumberInput source="amount" defaultValue={0} />
                    <DateInput
                        source="expecting_closing_date"
                        fullWidth
                        validate={[validateRequired, dateInPresentOrFuture]}
                        inputProps={{
                            min: new Date().toISOString().split('T')[0],
                        }}
                    />
                    <DateInput
                        source="start_at"
                        defaultValue={new Date()}
                        fullWidth
                        label="Starting date"
                        readOnly
                    />
                </SimpleForm>
            </Create>
        </Dialog>
    );
};

const ContactOptionRender = () => {
    const record: Contact | undefined = useRecordContext();
    if (!record) return null;
    return (
        <Stack direction="row" gap={1} alignItems="center">
            <Avatar record={record} />
            {record.first_name} {record.last_name}
        </Stack>
    );
};
const contactOptionText = <ContactOptionRender />;
const contactInputText = (choice: { first_name: string; last_name: string }) =>
    `${choice.first_name} ${choice.last_name}`;
