import path from 'path';
import fs from 'fs';
import { ProjectConfiguration } from './ProjectState.js';

export const generateAppFile = (
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
