import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import merge from 'lodash/merge';
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
            projectDirectory,
            ['package.json', '.env', 'README.md', 'help.txt', 'gitignore']
        );
    }

    if (state.authProvider !== 'none') {
        copyDirectoryFiles(
            path.join(__dirname, '../templates', state.authProvider),
            projectDirectory,
            ['package.json', '.env', 'README.md', 'help.txt', 'gitignore']
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
import { Layout } from './Layout';
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
        layout={Layout}
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
    const basePackageJson = getTemplatePackageJson('common');
    const dataProviderPackageJson = getTemplatePackageJson(state.dataProvider);
    const authProviderPackageJson = getTemplatePackageJson(state.authProvider);
    const packageJson = merge(
        basePackageJson,
        dataProviderPackageJson,
        authProviderPackageJson,
        {
            name: state.name,
        }
    );

    fs.writeFileSync(
        path.join(projectDirectory, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );
};

const generateGitIgnore = (projectDirectory: string) => {
    fs.copyFileSync(
        path.join(__dirname, '../templates/common/gitignore'),
        path.join(projectDirectory, '.gitignore')
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

const getTemplatePackageJson = (template: string) => {
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
        return JSON.parse(packageJson);
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
