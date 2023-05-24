import React from 'react';
import { useMutation, useQuery } from 'react-query';
import { Box, Text } from 'ink';
import { MultiSelect, Spinner, StatusMessage } from '@inkjs/ui';
import { getResourcesFromFiles } from './getResourcesFromFiles.js';
import { detectFeatures } from './detectFeatures.js';
import { generateTypedResourcesComponents } from './generateTypedResourcesComponents.js';

export default function App({
    fileNames = ['./src/types.ts'],
    out,
}: {
    fileNames: string[];
    out: string;
}) {
    const { data: features, isLoading: isLoadingFeatures } = useQuery(
        'features',
        async () => {
            return detectFeatures();
        }
    );
    const { data, isLoading: isLoadingResources } = useQuery(
        ['resources', fileNames, out],
        () => {
            return getResourcesFromFiles(fileNames, {});
        },
        {
            retry: false,
        }
    );

    const { mutate, error, status: generationStatus } = useMutation<
        void,
        Error,
        string[]
    >(resources => {
        generateTypedResourcesComponents(resources, out, features);
        return Promise.resolve();
    });

    if (error) {
        return <StatusMessage variant="error">{error.message}</StatusMessage>;
    }

    if (isLoadingResources || isLoadingFeatures) {
        return <Spinner label="Parsing files for resources..." />;
    }

    if (generationStatus === 'loading') {
        return (
            <Spinner label="Generating strongly typed components for your resources..." />
        );
    }

    if (generationStatus === 'success') {
        return (
            <StatusMessage variant="success">
                Successfully generated strongly typed components for your
                resources...
            </StatusMessage>
        );
    }

    if (data && data.length === 0) {
        return (
            <>
                <StatusMessage variant="warning">
                    <Text>
                        No resources found in the provided files:{' '}
                        {fileNames.join(', ')}
                    </Text>
                </StatusMessage>
                <Box>
                    <Text>
                        Make sure you exported your resources types and added a
                        @resource JsDoc comment on each:
                    </Text>
                </Box>
                <Box marginTop={1}>
                    <Text>{RESOURCE_EXAMPLE}</Text>
                </Box>
            </>
        );
    }

    if (data) {
        return (
            <>
                <Box>
                    <Text>Found the following resources.</Text>
                </Box>
                <Box>
                    <Text>
                        Toggle each resource with <Text bold>Space</Text>:{' '}
                    </Text>
                </Box>
                <Box marginBottom={1}>
                    <Text>
                        Confirm the selection with <Text bold>Enter</Text>:{' '}
                    </Text>
                </Box>
                <MultiSelect
                    options={data.map(resource => ({
                        label: resource,
                        value: resource,
                    }))}
                    defaultValue={data}
                    onSubmit={values => {
                        mutate(values);
                    }}
                />
            </>
        );
    }

    return null;
}

const RESOURCE_EXAMPLE = `/**
 * @Resource
 */
export type Post {
    id: number;
    title: string;
}`;
