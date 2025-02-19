import * as React from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { ChoiceType, SelectInputChoice } from './SelectInputChoice.js';
import { Stack } from './Stack.js';

const choices: ChoiceType[] = [
    {
        label: 'Using npm',
        value: 'npm',
    },
    {
        label: 'Using yarn',
        value: 'yarn',
    },
    {
        label: 'Using bun',
        value: 'bun',
    },
    {
        label: "Don't install dependencies, I'll do it myself.",
        value: 'skip',
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
            <Text>How do you want to install the dependencies?</Text>
            <SelectInput<string>
                items={choices}
                itemComponent={SelectInputChoice}
                onSelect={handleSelect}
                initialIndex={0}
            />
        </Stack>
    );
};
