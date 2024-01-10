import * as React from 'react';
import { Text } from 'ink';
import { Stack } from './Stack';

export type ChoiceType = {
    label: string;
    value: string;
    description?: string;
};

export const SelectInputChoice = ({
    isSelected = false,
    label,
    description,
}: {
    isSelected: boolean;
    label: string;
    description: string;
}) => {
    return (
        <Stack>
            <Text bold={isSelected ? true : false}>{label}</Text>
            <Text italic>{description}</Text>
        </Stack>
    );
};
