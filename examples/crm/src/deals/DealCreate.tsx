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
} from 'react-admin';
import { Dialog } from '@mui/material';

import { stageChoices } from './stages';
import { typeChoices } from './types';
import { Deal } from '../types';

export const DealCreate = ({ open }: { open: boolean }) => {
    const redirect = useRedirect();
    const dataProvider = useDataProvider();
    const validateRequired = required();

    const handleClose = () => {
        redirect('/deals');
    };

    const onSuccess = (deal: Deal) => {
        redirect('/deals');
        // increase the index of all deals in the same stage as the new deal
        dataProvider
            .getList('deals', {
                pagination: { page: 1, perPage: 50 },
                sort: { field: 'id', order: 'ASC' },
                filter: { stage: deal.stage },
            })
            .then(({ data: deals }) =>
                Promise.all(
                    deals
                        .filter(oldDeal => oldDeal.id !== deal.id)
                        .map(oldDeal =>
                            dataProvider.update('deals', {
                                id: oldDeal.id,
                                data: { index: oldDeal.index + 1 },
                                previousData: oldDeal,
                            })
                        )
                )
            );
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <Create<Deal>
                resource="deals"
                mutationOptions={{ onSuccess }}
                sx={{ width: 500 }}
            >
                <SimpleForm defaultValues={{ index: 0 }}>
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
