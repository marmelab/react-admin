export type ProjectConfiguration = {
    name: string;
    step:
        | 'data-provider'
        | 'auth-provider'
        | 'resources'
        | 'generate'
        | 'finish';
    dataProvider: string;
    authProvider: string;
    resources: string[];
};

export const InitialProjectConfiguration: ProjectConfiguration = {
    name: '',
    step: 'data-provider',
    dataProvider: '',
    authProvider: '',
    resources: [],
};
