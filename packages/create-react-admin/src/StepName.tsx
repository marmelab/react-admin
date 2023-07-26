import * as React from 'react';
import { useState } from 'react';
import TextInput from 'ink-text-input';
import { Text } from 'ink';
import { Stack } from './Stack';

export const StepName = ({
    onSubmit,
    initialValue,
}: {
    initialValue: string;
    onSubmit: (value: string) => void;
}) => {
    const [value, setValue] = useState(initialValue || '');

    const handleSubmit = (value: string) => {
        if (value !== '') {
            onSubmit(value);
        }
    };
    return (
        <Stack>
            <Text>
                Enter the name of your application, and validate with Enter:
            </Text>
            <TextInput
                value={value}
                onChange={v => setValue(v)}
                onSubmit={handleSubmit}
            />
        </Stack>
    );
};
