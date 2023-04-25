import React, { useReducer } from 'react';
import { Text } from 'ink';
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

type Props = {
    name: string | undefined;
};

const stepReducer = (
    state: ProjectConfiguration,
    action
): ProjectConfiguration => {
    switch (state.step) {
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
    const [state, dispatch] = useReducer(stepReducer, {
        ...InitialProjectConfiguration,
        name,
    });
    const installDeps = useInstallDeps();
    const handleSubmit = (value: any) => {
        dispatch({ value });
    };

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
        generateProject(state).then(() => {
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
            <Text>
                Your application <Text bold>{state.name}</Text> was successfully
                generated.
            </Text>
            <Text>
                To start working, run <Text bold>cd {state.name}</Text>.
            </Text>
            <Text>
                Start the app in development mode by running{' '}
                <Text bold>npm dev</Text>.
            </Text>
        </>
    );
}
