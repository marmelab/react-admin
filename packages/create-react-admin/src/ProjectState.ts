export type ProjectConfiguration = {
    name: string;
    step:
        | 'data-provider'
        | 'auth-provider'
        | 'resources'
        | 'generate'
        | 'install'
        | 'run-install'
        | 'finish';
    dataProvider: string;
    authProvider: string;
    resources: string[];
    installer: string;
};

export const InitialProjectConfiguration: ProjectConfiguration = {
    name: '',
    step: 'data-provider',
    dataProvider: '',
    authProvider: '',
    resources: [],
    installer: 'npm',
};
