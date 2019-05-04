import React from 'react';
import {
    AutocompleteInput,
    BooleanInput,
    DateInput,
    Edit,
    ReferenceInput,
    SelectInput,
    SimpleForm,
    useTranslate,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

import Basket from './Basket';

const OrderTitle = ({ record }) => {
    const translate = useTranslate();
    return (
        <span>
            {translate('resources.commands.title', {
                reference: record.reference,
            })}
        </span>
    );
};

const editStyles = {
    root: { alignItems: 'flex-start' },
};

const OrderEdit = props => (
    <Edit title={<OrderTitle />} aside={<Basket />} {...props}>
        <SimpleForm>
            <DateInput source="date" />
            <ReferenceInput source="customer_id" reference="customers">
                <AutocompleteInput
                    optionText={choice =>
                        `${choice.first_name} ${choice.last_name}`
                    }
                />
            </ReferenceInput>
            <SelectInput
                source="status"
                choices={[
                    { id: 'delivered', name: 'delivered' },
                    { id: 'ordered', name: 'ordered' },
                    { id: 'cancelled', name: 'cancelled' },
                    {
                        id: 'unknown',
                        name: 'unknown',
                        disabled: true,
                    },
                ]}
            />
            <BooleanInput source="returned" />
        </SimpleForm>
    </Edit>
);

export default withStyles(editStyles)(OrderEdit);
