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
    name?: string;
    authProvider?: string;
    dataProvider?: string;
    resources?: string[];
    install?: string;
};

const getNextStep = (state: ProjectConfiguration) => {
    if (state.name) {
        if (state.dataProvider) {
            if (state.authProvider) {
                if (state.resources) {
                    if (state.installer) {
                        return 'generate';
                    }
                    return 'install';
                }
                return 'resources';
            }
            return 'auth-provider';
        }
        return 'data-provider';
    }
    return 'name';
};

const stepReducer = (
    state: ProjectConfiguration,
    action
): ProjectConfiguration => {
    switch (state.step) {
        case 'name': {
            const newState = {
                ...state,
                name: action.value,
            };
            return {
                ...newState,
                step: getNextStep(newState),
            };
        }
        case 'data-provider': {
            const newState = {
                ...state,
                dataProvider: action.value,
                resources:
                    action.value === 'ra-data-fakerest'
                        ? ['posts', 'comments']
                        : state.resources,
            };
            return {
                ...newState,
                step: getNextStep(newState),
            };
        }
        case 'auth-provider': {
            const newState = {
                ...state,
                authProvider: action.value,
            };
            return {
                ...newState,
                step: getNextStep(newState),
            };
        }
        case 'resources': {
            const newState = {
                ...state,
                resources: action.value,
            };
            return {
                ...newState,
                step: getNextStep(newState),
            };
        }
        case 'install':
            const newState = {
                ...state,
                installer: action.value,
            };
            return {
                ...newState,
                step: getNextStep(newState),
            };
        case 'generate':
            return {
                ...state,
                messages: action.value.messages,
                step:
                    state.installer && state.installer !== 'skip'
                        ? 'run-install'
                        : 'finish',
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

export default function App(props: Props) {
    const sanitizedName = sanitizeName(props.name);
    const initialState = {
        ...InitialProjectConfiguration,
        dataProvider: props.dataProvider,
        authProvider: props.authProvider,
        resources: props.resources?.includes('skip') ? [] : props.resources,
        installer: props.install,
        name: sanitizedName,
    };

    const initialStep = getNextStep(initialState);

    const [state, dispatch] = useReducer(stepReducer, {
        ...initialState,
        step: initialStep,
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

const sanitizeName = (name?: string) => {
    return name
        ? name
              .trim()
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/^[._]/, '')
              .replace(/[^a-z\d\-~]+/g, '-')
        : undefined;
};
