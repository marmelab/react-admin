import { Stack } from '@mui/material';
import {
    AutocompleteArrayInput,
    AutocompleteInput,
    DateInput,
    NumberInput,
    ReferenceArrayInput,
    ReferenceInput,
    required,
    SelectInput,
    TextInput,
    useCreate,
    useGetIdentity,
    useNotify,
    useRecordContext,
} from 'react-admin';
import { Avatar } from '../contacts/Avatar';
import { useConfigurationContext } from '../root/ConfigurationContext';
import { Contact } from '../types';

const validateRequired = required();

export const DealInputs = () => {
    const { dealStages, dealCategories } = useConfigurationContext();

    const [create] = useCreate();
    const notify = useNotify();
    const { identity } = useGetIdentity();

    const handleCreateCompany = async (name?: string) => {
        if (!name) return;
        try {
            const newCompany = await create(
                'companies',
                {
                    data: {
                        name,
                        sales_id: identity?.id,
                        created_at: new Date().toISOString(),
                    },
                },
                { returnPromise: true }
            );
            return newCompany;
        } catch (error) {
            notify('An error occurred while creating the company', {
                type: 'error',
            });
        }
    };
    return (
        <>
            <TextInput
                source="name"
                label="Deal name"
                validate={validateRequired}
            />
            <TextInput source="description" multiline rows={3} />
            <ReferenceInput source="company_id" reference="companies">
                <AutocompleteInput
                    optionText="name"
                    onCreate={handleCreateCompany}
                    validate={validateRequired}
                />
            </ReferenceInput>

            <ReferenceArrayInput source="contact_ids" reference="contacts">
                <AutocompleteArrayInput
                    label="Contacts"
                    optionText={contactOptionText}
                    inputText={contactInputText}
                />
            </ReferenceArrayInput>

            <SelectInput
                source="stage"
                choices={dealStages.map(stage => ({
                    id: stage.value,
                    name: stage.label,
                }))}
                validate={validateRequired}
                defaultValue="opportunity"
            />
            <SelectInput
                source="category"
                label="Category"
                choices={dealCategories.map(type => ({
                    id: type,
                    name: type,
                }))}
            />
            <NumberInput
                source="amount"
                defaultValue={0}
                validate={validateRequired}
            />
            <DateInput
                source="expecting_closing_date"
                fullWidth
                validate={[validateRequired]}
            />
            <DateInput
                source="start_at"
                defaultValue={new Date()}
                fullWidth
                label="Starting date"
                readOnly
            />
        </>
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
