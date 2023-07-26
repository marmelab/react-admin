export type ProjectConfiguration = {
    name: string;
    step:
        | 'name'
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
    messages: string[];
    installer: string;
};

export const InitialProjectConfiguration: ProjectConfiguration = {
    name: '',
    step: 'name',
    dataProvider: '',
    authProvider: '',
    resources: [],
    messages: [],
    installer: '',
};
