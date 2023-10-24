import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import { ProjectConfiguration } from './ProjectState.js';

export const generateProject = async (state: ProjectConfiguration) => {
    const projectDirectory = initializeProjectDirectory(state.name);

    copyDirectoryFiles(
        path.join(__dirname, '../templates/common'),
        projectDirectory
    );
    replaceTokensInFile(path.join(projectDirectory, 'index.html'), state);
    replaceTokensInFile(
        path.join(projectDirectory, 'public/manifest.json'),
        state
    );

    if (state.dataProvider !== 'none') {
        copyDirectoryFiles(
            path.join(__dirname, '../templates', state.dataProvider),
            path.join(path.join(projectDirectory, 'src')),
            ['package.json', '.env', 'README.md', 'help.txt']
        );
    }

    if (state.authProvider !== 'none') {
        copyDirectoryFiles(
            path.join(__dirname, '../templates', state.authProvider),
            path.join(path.join(projectDirectory, 'src')),
            ['package.json', '.env', 'README.md', 'help.txt']
        );
    }

    generateAppFile(projectDirectory, state);
    generatePackageJson(projectDirectory, state);
    generateGitIgnore(projectDirectory);
    generateEnvFile(projectDirectory, state);
    generateReadme(projectDirectory, state);

    return getHelpMessages(state);
};

const getHelpMessages = (state: ProjectConfiguration) => {
    const dataProviderHelpMessages = getTemplateHelpMessages(
        state.dataProvider
    );
    const authProviderHelpMessages = getTemplateHelpMessages(
        state.authProvider
    );

    return [dataProviderHelpMessages, authProviderHelpMessages];
};

const getTemplateHelpMessages = (template: string) => {
    const helpMessagesPath = path.join(
        __dirname,
        '../templates',
        template,
        'help.txt'
    );
    if (fs.existsSync(helpMessagesPath)) {
        const helpMessages = fs.readFileSync(helpMessagesPath, 'utf-8');
        return helpMessages;
    }
    return '';
};

const generateAppFile = (
    projectDirectory: string,
    state: ProjectConfiguration
) => {
    fs.writeFileSync(
        path.join(projectDirectory, 'src', 'App.tsx'),
        `
import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';
${
    state.dataProvider !== 'none'
        ? `import { dataProvider } from './dataProvider';\n`
        : ''
}${
            state.authProvider !== 'none'
                ? `import { authProvider } from './authProvider';\n`
                : ''
        }
export const App = () => (
    <Admin
        ${
            state.dataProvider !== 'none'
                ? `dataProvider={dataProvider}\n\t`
                : ''
        }${
            state.authProvider !== 'none'
                ? `\tauthProvider={authProvider}\n\t`
                : ''
        }>
        ${state.resources
            .map(
                resource =>
                    `<Resource name="${resource}" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />`
            )
            .join('\n\t\t')}
    </Admin>
);

    `
    );
};

const generatePackageJson = (
    projectDirectory: string,
    state: ProjectConfiguration
) => {
    const dataProviderDeps = getTemplateDependencies(state.dataProvider);
    const authProviderDeps = getTemplateDependencies(state.authProvider);
    const allDeps = {
        ...BasePackageJson.dependencies,
        ...dataProviderDeps,
        ...authProviderDeps,
    };
    const allDepsNames = Object.keys(allDeps).sort();
    const dependencies = allDepsNames.reduce(
        (acc, depName) => ({
            ...acc,
            [depName]: allDeps[depName],
        }),
        {}
    );
    const packageJson = {
        name: state.name,
        ...BasePackageJson,
        dependencies,
    };

    fs.writeFileSync(
        path.join(projectDirectory, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
};

const generateGitIgnore = (projectDirectory: string) => {
    fs.writeFileSync(
        path.join(projectDirectory, '.gitignore'),
        defaultGitIgnore
    );
};

const generateEnvFile = (
    projectDirectory: string,
    state: ProjectConfiguration
) => {
    const dataProviderEnv = getTemplateEnv(state.dataProvider);
    const authProviderEnv = getTemplateEnv(state.authProvider);

    let env = '';

    if (dataProviderEnv) {
        env += `${dataProviderEnv}\n`;
    }

    if (authProviderEnv) {
        env += `${authProviderEnv}\n`;
    }

    if (env) {
        fs.writeFileSync(path.join(projectDirectory, '.env'), env);
    }
};

const getTemplateEnv = (template: string) => {
    if (template === 'none' || template === '') {
        return undefined;
    }
    const envPath = path.join(__dirname, '../templates', template, '.env');
    if (fs.existsSync(envPath)) {
        const env = fs.readFileSync(envPath, 'utf-8');
        return env;
    }
    return undefined;
};

const BasePackageJson = {
    private: true,
    scripts: {
        dev: 'vite',
        build: 'vite build',
        serve: 'vite preview',
        'type-check': 'tsc --noEmit',
        lint: 'eslint --fix --ext .js,.jsx,.ts,.tsx ./src',
        format: 'prettier --write ./src',
    },
    dependencies: {
        react: '^18.2.0',
        'react-admin': '^4.14.0',
        'react-dom': '^18.2.0',
    },
    devDependencies: {
        '@typescript-eslint/parser': '^5.60.1',
        '@typescript-eslint/eslint-plugin': '^5.60.1',
        '@types/node': '^18.16.1',
        '@types/react': '^18.0.22',
        '@types/react-dom': '^18.0.7',
        '@vitejs/plugin-react': '^4.0.1',
        eslint: '^8.43.0',
        'eslint-config-prettier': '^8.8.0',
        'eslint-plugin-react': '^7.32.2',
        'eslint-plugin-react-hooks': '^4.6.0',
        prettier: '^2.8.8',
        typescript: '^5.1.6',
        vite: '^4.3.9',
    },
};

const getTemplateDependencies = (template: string) => {
    if (template === 'none' || template === '') {
        return {};
    }
    const packageJsonPath = path.join(
        __dirname,
        '../templates',
        template,
        'package.json'
    );
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = fs.readFileSync(packageJsonPath, 'utf-8');
        return JSON.parse(packageJson).dependencies;
    }
    return {};
};

const initializeProjectDirectory = (projectName: string) => {
    let projectDirectory = process.cwd();

    if (path.dirname(projectDirectory) !== projectName) {
        if (fs.existsSync(path.join(process.cwd(), projectName))) {
            throw new Error(
                `A directory named ${projectName} already exists in the current directory. Please choose a different name.`
            );
        }
        projectDirectory = path.join(process.cwd(), projectName);
        fs.mkdirSync(projectDirectory);
    }
    return projectDirectory;
};

const copyDirectoryFiles = (
    source: string,
    destination: string,
    excludes?: string[]
) => {
    fsExtra.copySync(
        source,
        destination,
        excludes && excludes.length
            ? {
                  filter: (src: string) => {
                      if (excludes.some(exclude => src.endsWith(exclude))) {
                          return false;
                      }
                      return true;
                  },
              }
            : undefined
    );
};

const generateReadme = (
    projectDirectory: string,
    state: ProjectConfiguration
) => {
    const defaultReadme = getTemplateReadme('common');
    const dataProviderReadme = getTemplateReadme(state.dataProvider);
    const authProviderReadme = getTemplateReadme(state.authProvider);

    let readme = `${defaultReadme}`;

    if (dataProviderReadme) {
        readme += `\n${dataProviderReadme}`;
    }

    if (authProviderReadme) {
        readme += `\n${authProviderReadme}`;
    }

    if (readme) {
        fs.writeFileSync(
            path.join(projectDirectory, 'README.md'),
            replaceTokens(`${readme}\n`, state)
        );
    }
};

const getTemplateReadme = (template: string) => {
    if (template === 'none' || template === '') {
        return undefined;
    }
    const readmePath = path.join(
        __dirname,
        '../templates',
        template,
        'README.md'
    );
    if (fs.existsSync(readmePath)) {
        const readme = fs.readFileSync(readmePath, 'utf-8');
        return readme;
    }
    return undefined;
};

const replaceTokens = (content: string, state: ProjectConfiguration) => {
    let installCommand;
    let devCommand;
    let buildCommand;

    switch (state.installer) {
        case 'npm':
            installCommand = 'npm install';
            devCommand = 'npm run dev';
            buildCommand = 'npm run build';
            break;
        case 'yarn':
            installCommand = 'yarn';
            devCommand = 'yarn dev';
            buildCommand = 'yarn build';
            break;
        default:
            installCommand = 'npm install\n# or\nyarn install';
            devCommand = 'npm run dev\n# or\nyarn dev';
            buildCommand = 'npm run build\n# or\nyarn build';
    }

    return content
        .replace(`{{name}}`, state.name)
        .replace(`{{installCommand}}`, installCommand)
        .replace(`{{devCommand}}`, devCommand)
        .replace(`{{buildCommand}}`, buildCommand);
};

const replaceTokensInFile = (filePath: string, state: ProjectConfiguration) => {
    let fileContent = fs.readFileSync(filePath, 'utf-8');
    fileContent = replaceTokens(fileContent, state);
    fs.writeFileSync(filePath, fileContent);
};

const defaultGitIgnore = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;
