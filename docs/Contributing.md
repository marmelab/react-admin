---
layout: default
title: "Contributing to React-admin"
---

# Contributing to React-admin

If you want to give a hand: Thank you! There are many things you can do to help making react-admin better.

## How To Contribute

The easiest task is **bug triaging**. Check that new issues on GitHub follow the issue template and give a way to reproduce the issue. If not, comment on the issue to ask for precisions. Then, try and reproduce the issue following the description. If you managed to reproduce the issue, add a comment to say it. Otherwise, add a comment to say that something is missing. 

The second way to contribute is to **answer support questions on [Discord](https://discord.gg/GeZF9sqh3N) and [StackOverflow](https://stackoverflow.com/questions/tagged/react-admin)**. There are many beginner questions there, so even if you're not super experienced with react-admin, there is someone you can help there. 

Pull requests for **bug fixes** are welcome on the [GitHub repository](https://github.com/marmelab/react-admin). There is always a bunch of [issues labeled "Good First Issue"](https://github.com/marmelab/react-admin/issues?q=is%3Aopen+is%3Aissue+label%3A%22good+first+issue%22) in the bug tracker—start with these. 

If you want to **add a feature**, you can open a Pull request on the `next` branch. We don't accept all features—we try to keep the react-admin code small and manageable. Try and see if your feature can't be built as an additional `npm` package. If you're in doubt, open a "Feature Request" issue to see if the core team would accept your feature before developing it.

For all Pull requests, you must follow the coding style of the existing files (based on [prettier](https://github.com/prettier/prettier)), and include unit tests and documentation. Be prepared for a thorough code review, and be patient for the merge—this is an open-source initiative.

**Tip**: Most of the commands used by the react-admin developers are automated in the `makefile`. Feel free to type `make` without argument to see a list of the available commands. 

## Developer Setup

### Installation

Clone this repository and run `make install` to grab the dependencies, then `make build` to compile the sources from TypeScript to JS.

### Automated Tests

Automated tests are also crucial in our development process. You can run all the tests (linting, unit, and functional tests) by calling:

```sh
make test
```

Unit tests use `jest`, so you should be able to run a subset of tests, or run tests continuously on change, by passing options to 

```sh
yarn jest
```

Besides, tests related to the modified files are run automatically at commit using a git pre-commit hook. This means you won't be able to commit your changes if they break the tests. 

When working on the end-to-end tests, you can leverage the [cypress](https://www.cypress.io/) runner by starting the simple example yourself (`make run-simple` or `yarn run-simple`) and starting cypress in another terminal (`make test-e2e-local` or `yarn test-e2e-local`).

### Documentation

The documentation lives in the `docs/` directory. It's written in markdown and built using [Jekyll](https://jekyllrb.com/).

To preview changes in the documentation, call the following command:

```sh
make docker-doc
```

And then browse to [http://localhost:4000/documentation.html](http://localhost:4000/documentation.html).

### Testing Your Changes In The Example Apps

There are several examples inside the `examples` folder. They all use a fake REST API, so you can run them without setting up a backend.

* `simple` ([StackBlitz](https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/simple?file=src%2Findex.tsx)): a simple blog with posts, comments and users that we use for our e2e tests.
* `e-commerce`: ([demo](https://marmelab.com/react-admin-demo/), [source](https://github.com/marmelab/react-admin/tree/master/examples/demo)) A fictional poster shop admin, serving as the official react-admin demo.
* `CRM`: ([demo](https://marmelab.com/react-admin-crm/), [source](https://github.com/marmelab/react-admin/tree/master/examples/crm)) A customer relationship management application
* `tutorial` ([Stackblitz](https://stackblitz.com/github/marmelab/react-admin/tree/master/examples/tutorial)): the application built while following the [tutorial](https://marmelab.com/react-admin/Tutorial.html).

You can run those example applications by calling:

```sh
# At the react-admin project root
make install
# or
yarn install

# Run the simple application
make run-simple

# Run the e-commerce demo application
make build
make run-demo

# Run the CRM application
make build
make run-crm

# Run the tutorial application
make build
make run-tutorial
```

And then browse to the URL displayed in your console.

### Testing Your Changes In Your App

Using `yarn link`, you can have your project use a local checkout of the react-admin package instead of downloading from npm. This allows you to test react-admin changes in your app.

The following instructions are targeting yarn >= v3 in the client app.

```sh
# Go to the folder of your client app
$ cd /code/path/to/myapp/

# Use the latest version of yarn package manager
$ corepack enable && yarn set version stable

# Replace the npm-installed version with a symlink to your local version 
$ yarn link /code/path/to/react-admin/packages/react-admin

# If you modified additional internal packages in the react-admin monorepo, e.g. ra-core, also make a link
$ yarn link /code/path/to/react-admin/packages/ra-core

# Build all of the react-admin package distribution
$ cd /code/path/to/react-admin/ && make build

# Return to your app and ensure all dependencies have resolved 
$ cd /code/path/to/myapp/ && yarn install

# Start your app
$ yarn start
```

Tip: If you are still using yarn v1 as your package manager in your client app, we strongly recommend you to update as it is frozen and no longer maintained.

## Coding Standards

React-admin comes with its own linting and formatting rules. 

You can test that your code is compliant with these rules by calling

```sh
make lint
```

You can formatting issues automatically using `prettier` by calling

```sh
make prettier
```

These commands are run by our CI pipeline every time you push to the react-admin repository.

## User Experience Is King

React-admin has two distinct sets of users:

- End users, who use the react-admin app in their browser
- Developers, who work with the react-admin code in their IDE

We meticulously design both the User Experience (UX) and the Developer Experience (DX) for each feature.

For the visual part, react-admin builds upon Material UI, which is a practical implementation of [Material Design](https://m3.material.io/). This design system is painstakingly constructed for web and mobile apps and serves as an excellent foundation for creating user-friendly, consistent user interfaces. However, it's only part of the story.

We invest considerable time fine-tuning the UI to be as intuitive as possible. Small alignment discrepancies, screen flashes, and color inconsistencies are under constant scrutiny. We continually iterate based on customer feedback, working diligently to resolve any visual and animation issues that arise in real-world applications.

By default, react-admin produces a purposefully bland user interface because we want the focus to be on the content rather than the aesthetics.

<video controls autoplay playsinline muted loop>
  <source src="./img/sort-button.webm" type="video/webm"/>
  <source src="./img/sort-button.mp4" type="video/mp4"/>
  Your browser does not support the video tag.
</video>


Regarding the developer experience, react-admin is always evolving to strike the right balance between an intuitive API, advanced features, a reasonable level of abstraction, and comprehensive documentation. The core team members are the initial testers of react-admin, focusing on productivity, debuggability, discoverability, performance, and reliability of all hooks and components.

## Built On The Shoulders Of Giants

Many excellent open-source libraries already address partial requirements of B2B apps: data fetching, forms, UI components, testing, etc.

Rather than reinventing the wheel, react-admin uses the best tools in each category (in terms of features, developer experience, active maintenance, documentation, user base), and provides a glue around these libraries.

In react-admin v4, these libraries are called [React Query](https://tanstack.com/query/v3), [react-router](https://reactrouter.com/en/main), [react-hook-form](https://react-hook-form.com/), [Material UI](https://mui.com/), [emotion](https://emotion.sh/docs/introduction), [testing-library](https://testing-library.com/docs/react-testing-library/intro), [date-fns](https://date-fns.org/), and [lodash](https://lodash.com/).

When a new requirement arises, the react-admin teams always looks for an existing solution, and prefers integrating it rather than redeveloping it.

There is one constraint, though: all react-admin's dependencies must be compatible with the [MIT license](https://github.com/marmelab/react-admin/blob/master/LICENSE.md). 

## Backward Compatibility Is More Important Than New Features

Nobody enjoys updating their app's code simply because a foundational library has introduced a breaking change. React-admin makes a concerted effort to prevent such disruptions and the unnecessary time loss they cause for developers.

Some components may have peculiar APIs, often for historical reasons. We prioritize maintaining backward compatibility as much as possible, occasionally at the expense of API consistency.

## Principle of Least Surprise

Because react-admin is designed for [composition](./Architecture.md#composition), you should be able to combine react-admin components in various ways and expect them to "just work". If, for any reason, two components aren't compatible, the app should break as soon as possible. In most cases, strong TypeScript types help you detect these incompatibilities at compile time.

To minimize surprises, we avoid using `React.cloneElement()` and refrain from passing props down the tree. We also avoid child inspection.

An exception is the `<Datagrid>` component, which inspects its Field children at runtime to determine the column headers. This practice has significant drawbacks:

- If a child is wrapped inside another component that doesn't follow the same API, the feature breaks
- Developers typically expect a component to affect its subtree, not its ancestors. Violating this expectation can lead to difficult-to-explain bugs.

We keep child inspection in `<Datagrid>` for backwards compatibility reasons, but since then we introduced a superior alternative to solve the aforementioned issues: [`<DataTable>`](./DataTable.md).

## Principle Of Least Documentation

No one reads docs. This is an unfortunate reality that we have come to terms with.

Therefore, when designing a new feature, our priority is to make it as intuitive as possible for developers. We emulate the APIs of well-established libraries. We throw errors with clear and informative messages. To aid developers in discovering the API within their IDE, we provide TypeScript types and JSDoc. Furthermore, we publish [live examples](./Demos.md) complemented by annotated code.

Despite this, given the extensive nature of react-admin, it inevitably comes with comprehensive documentation. To ensure that you find the information you need quickly, we frequently duplicate the same information in different places. We truly believe in the power of [serendipity](https://en.wikipedia.org/wiki/Serendipity).

If you find this documentation overwhelming at first, don't fret. Switch the **[enable beginner mode](#beginner-mode)** on, and you'll get enough doc to become familiar with the basic react-admin API.

## Minimal API Surface

Before introducing a new hook or adding a new prop to an existing component, we always consider whether there's a straightforward way to implement the feature using pure React. If it's feasible, we opt not to add the new prop. Our goal is to maintain simplicity in the react-admin API, code, testing, and documentation. This decision is critical to ensuring a manageable learning curve and a low maintenance burden.

Take the `<SimpleShowLayout>` component as an example, which displays Field elements in a column. Suppose you want to place two fields in a single column. We could introduce a specific syntax to indicate the number of elements per column and per line. However, this would overcomplicate the usage and documentation for simple use cases. Moreover, achieving this is quite doable in pure React, without necessitating any changes in the react-admin core. For instance, you can utilize Material UI's `<Stack>` component:

```jsx
import * as React from 'react';
import { Show, SimpleShowLayout, TextField } from 'react-admin';
import { Stack } from '@mui/material';

const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <Stack direction="row" spacing={2}>
                <TextField source="title" />
                <TextField source="body" />
            </Stack>
            <TextField source="author" />
        </SimpleShowLayout>
    </Show>
);
```

We believe this code snippet is simple enough for a React developer, so we chose not to add core support for multiple elements per line.

If you can't find a specific feature in the react-admin documentation, it's often because it can be quickly achieved using pure React.

## Monorepo

Whenever you import a react-admin component, it's sourced from the `react-admin` package:

```jsx
import { List, Datagrid, TextField } from 'react-admin';
```

But if you peek at [the react-admin source code](https://github.com/marmelab/react-admin) (which we encourage you to do), you will find imports like:

```jsx
import { useListController } from 'ra-core';
```

That's because the `react-admin` package simply re-exports components from internal packages. React-admin is a *distribution* of several packages, each dedicated to a specific feature. These packages can be found in [the `packages/` directory](https://github.com/marmelab/react-admin/tree/master/packages). Some of the more notable packages include:
    
* `ra-core`: The core react-admin logic, without any UI.
* `ra-ui-materialui`: The Material UI skin for react-admin.
* `ra-data-*`: Data providers for various data backends.
* `ra-language-*`: Interface translations for various languages.
* `react-admin`: the standard distribution of react-admin

You can construct your own distribution of react-admin by combining various packages. Alternatively, you can import hooks and components directly from one of these packages if you don't want to import the entire react-admin distribution.
