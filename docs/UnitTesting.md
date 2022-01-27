---
layout: default
title: "Unit Testing"
---

# Unit Testing

React-admin relies heavily on unit tests (powered by [Jest](https://facebook.github.io/jest/) and [react-testing-library](https://testing-library.com/docs/react-testing-library/intro)) to ensure that its code is working as expected.

That means that each individual component and hook can be tested in isolation. That also means that if you have to test your own components and hooks based on react-admin, this should be straightforward.

## AdminContext Wrapper

Some of react-admin's components depend on a context for translation, theming, data fetching, etc. If you write a component that depends on a react-admin component, chances are the test runner will complain about a missing context (or Redux provider).

Wrap your tested component inside `<AdminContext>` to avoid this problem:

```jsx
import React from 'react';
import { AdminContext } from 'react-admin';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
        <AdminContext>
            <MyComponent />
        </AdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

**Tip**: you can also pass `AdminContext` as the `wrapper` option to the `render()` function:

```jsx
import React from 'react';
import { AdminContext } from 'react-admin';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(<MyComponent />, { wrapper: AdminContext });

const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

## Mocking Providers

`<AdminContext>` accepts the same props as `<Admin>`, so you can pass a custom `dataProvider`, `authProvider`, or `i18nProvider` for testing purposes. 

For instance, if the component to test calls the `useGetOne` hook:

```jsx
import React from 'react';
import { AdminContext } from 'react-admin';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
        <AdminContext dataProvider={{
            getOne: () => Promise.resolve({ data: { id: 1, name: 'foo' } }),
        }}>
            <MyComponent />
        </AdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

**Tip**: If you're using TypeScript, the compiler will complain about missing methods in the data provider above. You can remove these warnings by using the `testDataProvider` helper:

```jsx
import React from 'react';
import { AdminContext, testDataProvider } from 'react-admin';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
        <AdminContext dataProvider={testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 1, name: 'foo' } }),
        })}>
            <MyComponent />
        </AdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

## Testing Permissions

As explained on the [Auth Provider chapter](./Authentication.md#authorization), it's possible to manage permissions via the `authProvider` in order to filter page and fields the users can see.

In order to avoid regressions and make the design explicit to your co-workers, it's better to unit test which fields are supposed to be displayed or hidden for each permission.

Here is an example with Jest and TestingLibrary, which is testing the [`UserShow` page of the simple example](https://github.com/marmelab/react-admin/blob/master/examples/simple/src/users/UserShow.tsx).

```jsx
// UserShow.spec.js
import * as React from "react";
import { render, fireEvent } from '@testing-library/react';
import { AdminContext } from 'react-admin';

import UserShow from './UserShow';

describe('UserShow', () => {
    describe('As User', () => {
        it('should display one tab', () => {
            const testUtils = render(<UserShow permissions="user" />);

            const tabs = testUtils.queryAllByRole('tab');
            expect(tabs).toHaveLength(1);
        });

        it('should show the user identity in the first tab', () => {
            const dataProvider = {
                getOne: Promise.resolve({
                    id: 1,
                    name: 'Leila'
                })
            }
            const testUtils = render(
                <AdminContext dataProvider={dataProvider}>
                    <UserShow permissions="user" id="1" />
                </AdminContext>
            );

            expect(testUtils.queryByDisplayValue('1')).not.toBeNull();
            expect(testUtils.queryByDisplayValue('Leila')).not.toBeNull();
        });
    });

    describe('As Admin', () => {
        it('should display two tabs', () => {
            const testUtils = render(<UserShow permissions="user" />);

            const tabs = testUtils.queryAllByRole('tab');
            expect(tabs).toHaveLength(2);
        });

        it('should show the user identity in the first tab', () => {
            const dataProvider = {
                getOne: Promise.resolve({
                    id: 1,
                    name: 'Leila'
                })
            }
            const testUtils = render(
                <AdminContext dataProvider={dataProvider}>
                    <UserShow permissions="user" id="1" />
                </AdminContext>
            );

            expect(testUtils.queryByDisplayValue('1')).not.toBeNull();
            expect(testUtils.queryByDisplayValue('Leila')).not.toBeNull();
        });

        it('should show the user role in the second tab', () => {
            const dataProvider = {
                getOne: Promise.resolve({
                    id: 1,
                    name: 'Leila',
                    role: 'admin'
                })
            }
            const testUtils = render(
                <AdminContext dataProvider={dataProvider}>
                    <UserShow permissions="user" id="1" />
                </AdminContext>
            );

            fireEvent.click(testUtils.getByText('Security'));
            expect(testUtils.queryByDisplayValue('admin')).not.toBeNull();
        });
    });
});
```
