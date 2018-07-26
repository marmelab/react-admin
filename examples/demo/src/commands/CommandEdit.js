import React from 'react';
import {
    translate,
    AutocompleteInput,
    BooleanInput,
    DateInput,
    Edit,
    ReferenceInput,
    SelectInput,
    SimpleForm,
} from 'react-admin';
import withStyles from '@material-ui/core/styles/withStyles';

import Basket from './Basket';

const CommandTitle = translate(({ record, translate }) => (
    <span>
        {translate('resources.commands.name', { smart_count: 1 })} #{
            record.reference
        }
    </span>
));

const editStyles = {
    clear: { clear: 'both' },
};

const CommandEdit = ({ classes, ...props }) => (
    <Edit title={<CommandTitle />} {...props}>
        <SimpleForm>
            <Basket />
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
                ]}
            />
            <BooleanInput source="returned" />
        </SimpleForm>
    </Edit>
);

export default withStyles(editStyles)(CommandEdit);
