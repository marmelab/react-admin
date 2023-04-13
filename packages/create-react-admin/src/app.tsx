import React, { useReducer } from 'react';
import { Box, Text } from 'ink';
import {
    InitialProjectConfiguration,
    ProjectConfiguration,
} from './ProjectState.js';
import { generateProject } from './generateProject.js';
import { StepDataProvider } from './StepDataProvider.js';
import { StepAuthProvider } from './StepAuthProvider.js';
import { StepResources } from './StepResources.js';

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
    return (
        <>
            <Text>
                Generated your application{' '}
                <Text color="blue">{state.name}</Text> with{' '}
                <Text color="blue">{state.dataProvider}</Text>{' '}
                {state.authProvider !== 'none' ? (
                    <>
                        and <Text color="blue">{state.authProvider}</Text>
                    </>
                ) : null}
            </Text>
            {state.resources.length > 0 ? (
                <>
                    <Text>The following resources will be created:</Text>
                    {state.resources.map(resource => (
                        <Box>
                            <Text>- </Text>
                            <Text color="blue">{resource}</Text>
                            <Text>,</Text>
                        </Box>
                    ))}
                </>
            ) : null}
        </>
    );
}
