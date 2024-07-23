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
import { Contact } from '../types';
import { Stack } from '@mui/material';
import { Avatar } from '../contacts/Avatar';
import { useConfigurationContext } from '../root/ConfigurationContext';

const validateRequired = required();

const dateInPresentOrFuture = (value: string) => {
    const valueDate = new Date(value).setHours(0, 0, 0, 0);
    const presentDate = new Date().setHours(0, 0, 0, 0);
    if (valueDate < presentDate) {
        return 'The date must be in the present or the future';
    }
    return undefined;
};

export const DealForm = () => {
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
            throw error;
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
