import React from 'react';
import {
    FormDataConsumer,
    InferredElementDescription,
    SelectInput,
} from 'react-admin';
import get from 'lodash/get';
import { useResourcesConfiguration } from './useResourcesConfiguration';

export const ConfigurationInputsFromFieldDefinition = ({
    definition,
    sourcePrefix,
}: {
    definition: InferredElementDescription;
    sourcePrefix?: string;
}) => {
    const [resources] = useResourcesConfiguration();

    switch (definition.type) {
        case 'reference':
            return (
                <>
                    <SelectInput
                        source={`${sourcePrefix}.props.reference`}
                        label="Referenced resource"
                        choices={Object.keys(resources).map(name => ({
                            id: name,
                            name: resources[name].label || resources[name].name,
                        }))}
                    />
                    <SelectInput
                        source={`${sourcePrefix}.options.selectionType`}
                        label="How to select the reference"
                        choices={ReferenceSelectionChoice}
                    />
                    <FormDataConsumer>
                        {({ formData }) => {
                            const resourceName = get(
                                formData,
                                `${sourcePrefix}.props.reference`
                            );
                            if (!resourceName) return null;

                            const resource = resources[resourceName];
                            return (
                                <SelectInput
                                    source={`${sourcePrefix}.options.referenceField`}
                                    label="Displayed field"
                                    choices={resource.fields.map(field => ({
                                        id: field.props.source,
                                        name:
                                            field.props.label ||
                                            field.props.source,
                                    }))}
                                />
                            );
                        }}
                    </FormDataConsumer>
                </>
            );
        default:
            return null;
    }
};

const ReferenceSelectionChoice = [
    { id: 'select', name: 'Simple list' },
    { id: 'autocomplete', name: 'Searchable list' },
    { id: 'radio', name: 'Radio buttons' },
];
