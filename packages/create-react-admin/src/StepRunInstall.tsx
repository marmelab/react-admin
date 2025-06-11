import React, { useEffect } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { ProjectConfiguration } from './ProjectState.js';
import { useInstallDeps } from './useInstallDeps.js';
import { useRunFormatter } from './useRunFormatter.js';

export const StepRunInstall = ({
    config,
    onCompleted,
}: {
    config: ProjectConfiguration;
    onCompleted: (value: any) => void;
}) => {
    const installDeps = useInstallDeps();
    const runFormatter = useRunFormatter();

    useEffect(() => {
        installDeps(config).then(() => {
            runFormatter(config).then(() => {
                onCompleted({});
            });
        });
        // Disabled as we want to run this only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box gap={1}>
            <Text color="green">
                <Spinner type="dots" />
            </Text>
            <Text>Installing dependencies...</Text>
        </Box>
    );
};
