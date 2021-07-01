import * as React from 'react';
import {
    AutocompleteInput,
    RadioButtonGroupInput,
    SelectInput,
} from 'ra-ui-materialui';
import { ReferenceFieldConfiguration } from '../ResourceConfiguration';

export const ReferenceInputChildFromDefinition = ({
    definition,
    ...props
}: ReferenceInputChildFromDefinitionProps) => {
    if (definition.options.selectionType === 'select') {
        return (
            <SelectInput
                optionText={definition.options.referenceField}
                {...props}
            />
        );
    }

    if (definition.options.selectionType === 'autocomplete') {
        return (
            <AutocompleteInput
                optionText={definition.options.referenceField}
                {...props}
            />
        );
    }

    if (definition.options.selectionType === 'radio') {
        return (
            <RadioButtonGroupInput
                optionText={definition.options.referenceField}
                {...props}
            />
        );
    }
};

interface ReferenceInputChildFromDefinitionProps {
    definition: ReferenceFieldConfiguration;
}
