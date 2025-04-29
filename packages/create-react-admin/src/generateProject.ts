import path from 'path';
import fs from 'fs';
import fsExtra from 'fs-extra';
import url from 'url';
import execa from 'execa';
import merge from 'lodash/merge.js';
import { ProjectConfiguration } from './ProjectState.js';
import { generateAppFile } from './generateAppFile.js';
import { generateAppTestFile } from './generateAppTestFile.js';

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateProject = async (state: ProjectConfiguration) => {
    const projectDirectory = initializeProjectDirectory(state.name);
    copyDirectoryFiles(
        path.join(__dirname, '../templates/common'),
        projectDirectory,
        ['gitignore']
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

    if (!hasTemplateAppFile(state.dataProvider)) {
        generateAppFile(projectDirectory, state);
    }
    if (state.dataProvider === 'ra-data-fakerest') {
        if (
            ['posts', 'comments'].every(resource =>
                state.resources.includes(resource)
            )
        ) {
            generateAppTestFile(projectDirectory, state);
        } else {
            generateDataForFakeRest(projectDirectory, state);
        }
    }

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

const generatePackageJson = (
    projectDirectory: string,
    state: ProjectConfiguration
) => {
    let yarnVersion: string;
    const basePackageJson = getTemplatePackageJson('common');
    const dataProviderPackageJson = getTemplatePackageJson(state.dataProvider);
    const authProviderPackageJson = getTemplatePackageJson(state.authProvider);
    const resolutionsPackageJson = getTemplatePackageJson('resolutions');
    if (state.installer === 'yarn') {
        yarnVersion = getYarnVersion();
    }
    const needResolutions = yarnVersion && yarnVersion.startsWith('1');

    const packageJson = merge(
        basePackageJson,
        dataProviderPackageJson,
        authProviderPackageJson,
        needResolutions ? resolutionsPackageJson : {},
        yarnVersion
            ? {
                  packageManager: `yarn@${yarnVersion}`,
              }
            : {},
        {
            name: state.name,
        }
    );

    fs.writeFileSync(
        path.join(projectDirectory, 'package.json'),
        JSON.stringify(packageJson, null, 2)
    );

    if (yarnVersion && !yarnVersion.startsWith('1')) {
        copyDirectoryFiles(
            path.join(__dirname, '../templates/yarn'),
            projectDirectory
        );
    }
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

const hasTemplateAppFile = (template: string) => {
    if (template === 'none' || template === '') {
        return undefined;
    }
    const filePath = path.join(
        __dirname,
        '../templates',
        template,
        'src/App.tsx'
    );
    return fs.existsSync(filePath);
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
        case 'bun':
            installCommand = 'bun install';
            devCommand = 'bun run dev';
            buildCommand = 'bun run build';
            break;
        case 'yarn':
            installCommand = 'yarn';
            devCommand = 'yarn dev';
            buildCommand = 'yarn build';
            break;
        default:
            installCommand =
                'npm install\n# or\nyarn install\n# or\nbun install';
            devCommand = 'npm run dev\n# or\nyarn dev\n# or\bun run dev';
            buildCommand =
                'npm run build\n# or\nyarn build\n# or\nbun run build';
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

const getYarnVersion = () => {
    // We can't use process.env.npm_config_user_agent as users may use another package manager than yarn but still
    // want to use yarn to install the dependencies.
    const { stdout } = execa.sync('yarn', ['--version'], { stdio: 'pipe' });
    return stdout;
};

const generateDataForFakeRest = (
    projectDirectory: string,
    state: ProjectConfiguration
) => {
    const data = state.resources.reduce((acc, resource) => {
        acc[resource] = [];
        return acc;
    }, {});
    fs.writeFileSync(
        path.join(projectDirectory, 'src', 'data.json'),
        JSON.stringify(data, null, 2)
    );
};
