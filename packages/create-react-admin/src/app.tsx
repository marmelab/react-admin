import React, { useReducer } from 'react';
import { Box, Text, Newline } from 'ink';
import {
    InitialProjectConfiguration,
    ProjectConfiguration,
} from './ProjectState.js';
import { StepDataProvider } from './StepDataProvider.js';
import { StepAuthProvider } from './StepAuthProvider.js';
import { StepResources } from './StepResources.js';
import { StepInstall } from './StepInstall.js';
import { StepName } from './StepName.js';
import { StepGenerate } from './StepGenerate';
import { StepRunInstall } from './StepRunInstall';

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
                        ? 'install'
                        : 'resources',
                authProvider: action.value,
            };
        case 'resources':
            return {
                ...state,
                step: 'install',
                resources: action.value,
            };
        case 'install':
            return {
                ...state,
                installer: action.value,
                step: 'generate',
            };
        case 'generate':
            return {
                ...state,
                messages: action.value.messages,
                step: state.installer ? 'run-install' : 'finish',
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
    if (state.step === 'install') {
        return <StepInstall onSubmit={handleSubmit} />;
    }
    if (state.step === 'generate') {
        return <StepGenerate config={state} onCompleted={handleSubmit} />;
    }
    if (state.step === 'run-install') {
        return <StepRunInstall config={state} onCompleted={handleSubmit} />;
    }
    return (
        <>
            <Box marginBottom={1} marginTop={1}>
                <Text>
                    Your application <Text bold>{state.name}</Text> was
                    successfully generated.
                </Text>
            </Box>
            <Text>
                To start working, run <Text bold>cd {state.name}</Text>.
            </Text>
            {state.installer ? (
                <Text>
                    Start the app in development mode by running{' '}
                    <Text bold>
                        {state.installer === 'npm' ? 'npm run' : 'yarn'} dev
                    </Text>
                    .
                </Text>
            ) : (
                <Box>
                    <Text>
                        Install the dependencies using your favorite package
                        manager.
                        <Newline />
                        Run the <Text bold>dev</Text> command to start the app.
                    </Text>
                </Box>
            )}
            <Box marginBottom={1}>
                {state.messages.map((line, index) => (
                    <Text key={index}>{line}</Text>
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
