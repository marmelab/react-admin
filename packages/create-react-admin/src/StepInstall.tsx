import * as React from 'react';
import SelectInput from 'ink-select-input';
import { ChoiceType, SelectInputChoice } from './SelectInputChoice.js';
import { Text } from 'ink';
import { Stack } from './Stack.js';

const choices: ChoiceType[] = [
    {
        label: 'Install dependencies with npm',
        value: 'npm',
    },
    {
        label: 'Install dependencies with yarn',
        value: 'yarn',
    },
    {
        label: "Don't install dependencies",
        value: '',
    },
];

export const StepInstall = ({
    onSubmit,
}: {
    onSubmit: (value: string) => void;
}) => {
    const handleSelect = (item: ChoiceType) => {
        onSubmit(item.value);
    };
    return (
        <Stack>
            <Text>Should we install the dependencies for you?</Text>
            <SelectInput<string>
                items={choices}
                itemComponent={SelectInputChoice}
                onSelect={handleSelect}
                initialIndex={0}
            />
        </Stack>
    );
};
