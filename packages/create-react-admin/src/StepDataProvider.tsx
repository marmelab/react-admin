import * as React from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { ChoiceType, SelectInputChoice } from './SelectInputChoice.js';
import { Stack } from './Stack.js';

const SupportedDataProviders: ChoiceType[] = [
    {
        label: 'Fakerest',
        value: 'ra-data-fakerest',
        description:
            'A client-side in memory data provider that use a JSON object as its initial data.',
    },
    {
        label: 'JSON Server',
        value: 'ra-data-json-server',
        description:
            'A dataProvider based on JSON Server dialect (https://github.com/typicode/json-server)',
    },
    {
        label: 'Simple REST',
        value: 'ra-data-simple-rest',
        description:
            'A Simple REST Data Provider (https://github.com/marmelab/react-admin/tree/master/packages/ra-data-simple-rest)',
    },
    {
        label: 'None',
        value: 'none',
        description:
            'Choose this if the dataProvider you want to use is not supported by this tool yet.',
    },
];

export const StepDataProvider = ({
    onSubmit,
}: {
    onSubmit: (value: string) => void;
}) => {
    const handleSelect = (item: ChoiceType) => {
        onSubmit(item.value);
    };

    return (
        <Stack>
            <Text>
                Select the data provider you want to use and validate with
                Enter:
            </Text>
            <SelectInput<string>
                items={SupportedDataProviders}
                itemComponent={SelectInputChoice}
                onSelect={handleSelect}
                initialIndex={0}
            />
        </Stack>
    );
};
