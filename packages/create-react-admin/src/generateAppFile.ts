import path from 'path';
import fs from 'fs';
import { ProjectConfiguration } from './ProjectState.js';

const tab = '    ';
export const generateAppFile = (
    projectDirectory: string,
    state: ProjectConfiguration
) => {
    fs.writeFileSync(
        path.join(projectDirectory, 'src', 'App.tsx'),
        `
${
    state.resources.length > 0
        ? `import { Admin, Resource, ListGuesser, EditGuesser, ShowGuesser } from 'react-admin';`
        : `import { Admin } from 'react-admin';`
}
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
        layout={Layout}${state.dataProvider !== 'none' ? `\n${tab}${tab}dataProvider={dataProvider}` : ''}${
            state.authProvider !== 'none'
                ? `\n${tab}${tab}authProvider={authProvider}`
                : ''
        }
    >
        ${state.resources
            .map(
                resource =>
                    `<Resource name="${resource}" list={ListGuesser} edit={EditGuesser} show={ShowGuesser} />`
            )
            .join(`\n${tab}${tab}`)}
    </Admin>
);

`
    );
};
