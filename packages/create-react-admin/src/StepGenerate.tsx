import React, { useEffect } from 'react';
import { Text } from 'ink';
import { generateProject } from './generateProject';
import { ProjectConfiguration } from './ProjectState';

export const StepGenerate = ({
    config,
    onCompleted,
}: {
    config: ProjectConfiguration;
    onCompleted: (value: any) => void;
}) => {
    useEffect(() => {
        generateProject(config).then(messages => onCompleted({ messages }));
        // Disabled as we want to run this only once
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Text>Generating your application...</Text>;
};
