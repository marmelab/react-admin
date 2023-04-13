import * as React from 'react';
import { ReactNode } from 'react';
import { Box, BoxProps } from 'ink';

export const Stack = (props: { children: ReactNode } & BoxProps) => {
    return <Box flexDirection="column" marginBottom={1} {...props} />;
};
