import React, { useReducer, useRef } from 'react';
import { Box, Text } from 'ink';
import {
    InitialProjectConfiguration,
    ProjectConfiguration,
} from './ProjectState.js';
import { generateProject } from './generateProject.js';
import { StepDataProvider } from './StepDataProvider.js';
import { StepAuthProvider } from './StepAuthProvider.js';
import { StepResources } from './StepResources.js';
import { StepInstall } from './StepInstall.js';
import { useInstallDeps } from './useInstallDeps.js';
import { StepName } from './StepName.js';

type Props = {
    name: string | undefined;
};

const stepReducer = (
    state: ProjectConfiguration,
    action
): ProjectConfiguration => {
    switch (state.step) {
        case 'name':
            return {
                ...state,
                name: action.value,
                step: 'data-provider',
            };
        case 'data-provider':
            return {
                ...state,
                step: 'auth-provider',
                dataProvider: action.value,
                resources:
                    action.value === 'ra-data-fakerest'
                        ? ['posts', 'comments']
                        : state.resources,
            };
        case 'auth-provider':
            return {
                ...state,
                step:
                    state.dataProvider === 'ra-data-fakerest'
                        ? 'generate'
                        : 'resources',
                authProvider: action.value,
            };
        case 'resources':
            return {
                ...state,
                step: 'generate',
                resources: action.value,
            };
        case 'generate':
            return {
                ...state,
                step: 'install',
            };
        case 'install':
            return {
                ...state,
                installer: action.value,
                step: action.value ? 'run-install' : 'finish',
            };
        case 'run-install':
            return {
                ...state,
                step: 'finish',
            };
        default:
            return state;
    }
};

export default function App({ name = 'my-admin' }: Props) {
    const sanitizedName = sanitizeName(name);
    const [state, dispatch] = useReducer(stepReducer, {
        ...InitialProjectConfiguration,
        name: sanitizedName,
        step: sanitizedName === name ? 'data-provider' : 'name',
    });
    const helpMessages = useRef([]);
    const installDeps = useInstallDeps();
    const handleSubmit = (value: any) => {
        dispatch({ value });
    };

    if (state.step === 'name') {
        return <StepName initialValue={state.name} onSubmit={handleSubmit} />;
    }
    if (state.step === 'data-provider') {
        return <StepDataProvider onSubmit={handleSubmit} />;
    }
    if (state.step === 'auth-provider') {
        return <StepAuthProvider onSubmit={handleSubmit} />;
    }
    if (state.step === 'resources') {
        return <StepResources onSubmit={handleSubmit} />;
    }
    if (state.step === 'generate') {
        generateProject(state).then(messages => {
            helpMessages.current = messages;
            dispatch({});
        });
        return <Text>Generating your application...</Text>;
    }
    if (state.step === 'install') {
        return <StepInstall onSubmit={handleSubmit} />;
    }
    if (state.step === 'run-install') {
        installDeps(state).then(() => {
            dispatch({});
        });
        return <Text>Installing dependencies...</Text>;
    }
    return (
        <>
            <Box marginBottom={1}>
                <Text>
                    Your application <Text bold>{state.name}</Text> was
                    successfully generated.
                </Text>
            </Box>
            <Text>
                To start working, run <Text bold>cd {state.name}</Text>.
            </Text>
            <Text>
                Start the app in development mode by running{' '}
                <Text bold>
                    {state.installer === 'npm' ? 'npm run' : 'yarn'} dev
                </Text>
                .
            </Text>
            <Box marginBottom={1}>
                {helpMessages.current.map(line => (
                    <Text key={line}>{line}</Text>
                ))}
            </Box>
        </>
    );
}

const sanitizeName = (name: string) => {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/^[._]/, '')
        .replace(/[^a-z\d\-~]+/g, '-');
};
