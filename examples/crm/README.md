# React-admin CRM

This is a demo of the [react-admin](https://github.com/marmelab/react-admin) library for React.js. It's a CRM for a fake Web agency with a few sales. You can test it online at https://marmelab.com/react-admin-crm.

https://user-images.githubusercontent.com/99944/116970434-4a926480-acb8-11eb-8ce2-0602c680e45e.mp4

React-admin usually requires a REST/GraphQL server to provide data. In this demo, however, the API is simulated by the browser (using [FakeRest](https://github.com/marmelab/FakeRest)). The source data is generated at runtime by a package called [data-generator](https://github.com/marmelab/react-admin/tree/master/examples/data-generator).

To explore the source code, start with [src/App.tsx](https://github.com/marmelab/react-admin/blob/master/examples/crm/src/App.tsx).

**Note**: This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

## How to run

After having cloned the react-admin repository, run the following commands at the react-admin root:

```sh
make install

make build

make run-crm
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](#running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

### `npm run deploy`

Deploy the build to GitHub gh-pages.

## Look and Feel

This project offers a customizable CRM component. It leverages React context, allowing props to be accessed in any child component. By default, the values are sourced from the `crm.config.ts` file, but you can also override these props directly through the CRM component.

```tsx
// App.tsx
import React from 'react';
import CRM from './CRM';
import { crmConfig } from './crm.config';

const App = () => (
    <CRM 
        title="Custom CRM Title" 
        logo="custom-logo.png" 
    />
);

export default App;
```
You can also pass a custom `lightTheme` object to the CRM component to override the default React-admin theme. While React-admin supports `darkTheme`, you can add a theme switch button by including a ToggleThemeButton component in the Toolbar. For more information, refer to the [React-admin theme documentation](https://marmelab.com/react-admin/AppTheme.html).

## Domain & Process

In addition to the design, you can easily customize various aspects relevant to your business domain. The behavior is the same as described above. You can modify the following:

| Props          | Description                                   | Type     |
|----------------|-----------------------------------------------|----------|
| companySectors | The industry sectors of the companies you add | string[] |
| dealStages     | Stages used for sort deals in the kaban       | { value: string; label: string }[];[] |
| dealCategories | Categories that defined a deal    | string[] |
| noteStatuses   | Statuses that defined a note    | { value: string; label: string; color: string }[] |
| taskTypes      | Types that defined a task    | string[] |


```tsx
import { CRM } from './CRM/CRM';
import { crmConfig } from './CRM/crm.config';

const App = () => (
    <CRM
        title={crmConfig.title}
        logo={crmConfig.logo}
        companySectors={crmConfig.companySectors}
        dealStages={crmConfig.dealStages}
        dealCategories={crmConfig.dealCategories}
        noteStatuses={crmConfig.noteStatuses}
        taskTypes={crmConfig.taskTypes}
    />
);

export default App;
```

## Add Sales

To add a new sale to the CRM, you need to use an administrator account. By default, the first account created has this role. If you are starting fresh, a sign-up page will prompt you to create this admin account.

When logged in as an admin, an 'Account Manager' tab will be available. From this page, you can create sales and transfer the administrator role.

## Customize the Homepage

The first page of the application is managed by the `Dashboard.tsx` component. You can customize it by updating this file.
