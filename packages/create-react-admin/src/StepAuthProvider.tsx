import * as React from 'react';
import { Text } from 'ink';
import SelectInput from 'ink-select-input';
import { ChoiceType, SelectInputChoice } from './SelectInputChoice';
import { Stack } from './Stack';

const SupportedAuthProviders: ChoiceType[] = [
    {
        label: 'Hard coded local username/password',
        value: 'local-auth-provider',
        description: 'Hard coded local username/password',
    },
    { label: 'None', value: 'none', description: 'No authProvider' },
];

export const StepAuthProvider = ({
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
                Select the auth provider you want to use, and validate with
                Enter:
            </Text>
            <SelectInput
                items={SupportedAuthProviders}
                itemComponent={SelectInputChoice}
                onSelect={handleSelect}
                initialIndex={0}
            />
        </Stack>
    );
};
