---
layout: default
title: "Unit Testing"
---

Ra-core relies heavily on unit tests (powered by [Jest](https://facebook.github.io/jest/) and [react-testing-library](https://testing-library.com/docs/react-testing-library/intro)) to ensure that its code is working as expected.

That means that each individual component and hook can be tested in isolation. That also means that if you have to test your own components and hooks based on ra-core, this should be straightforward.

## CoreAdminContext Wrapper

Some of ra-core's components depend on a context for translation, data fetching, etc. If you write a component that depends on a ra-core component, chances are the test runner will complain about a missing context.

Wrap your tested component inside `<CoreAdminContext>` to avoid this problem:

```jsx
import React from 'react';
import { CoreAdminContext } from 'ra-core';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
        <CoreAdminContext>
            <MyComponent />
        </CoreAdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

**Tip**: you can also pass `CoreAdminContext` as the `wrapper` option to the `render()` function:

```jsx
import React from 'react';
import { CoreAdminContext } from 'ra-core';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(<MyComponent />, { wrapper: CoreAdminContext });

const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

## Mocking Providers

`<CoreAdminContext>` accepts the same props as `<Admin>`, so you can pass a custom `dataProvider`, `authProvider`, or `i18nProvider` for testing purposes. 

For instance, if the component to test calls the `useGetOne` hook:

{% raw %}
```jsx
import React from 'react';
import { CoreAdminContext } from 'ra-core';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
        <CoreAdminContext dataProvider={{
            getOne: () => Promise.resolve({ data: { id: 1, name: 'foo' } }),
        }}>
            <MyComponent />
        </CoreAdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```
{% endraw %}

**Tip**: If you're using TypeScript, the compiler will complain about missing methods in the data provider above. You can remove these warnings by using the `testDataProvider` helper:

```jsx
import React from 'react';
import { CoreAdminContext, testDataProvider } from 'ra-core';
import { render, screen } from '@testing-library/react';

import MyComponent from './MyComponent';

test('<MyComponent>', async () => {
    render(
        <CoreAdminContext dataProvider={testDataProvider({
            getOne: () => Promise.resolve({ data: { id: 1, name: 'foo' } }),
        })}>
            <MyComponent />
        </CoreAdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /)
    expect(items).toHaveLength(10)
})
```

## Resetting The Store

The ra-core Store is persistent. This means that if a test modifies an item in the store, the updated value will be changed in the next test. This will cause seemingly random test failures when you use `useStore()` in your tests, or any feature depending on the store (e.g. row selection, sidebar state, language selection).

To isolate your unit tests, pass a new `memoryStore` at each test:

```jsx
import { memoryStore } from 'ra-core';

test('<MyComponent>', async () => {
    const { getByText } = render(
        <CoreAdminContext store={memoryStore()}>
            <MyComponent />
        </CoreAdminContext>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /);
    expect(items).toHaveLength(10);
})
```

If you don't need `<CoreAdminContext>`, you can just wrap your component with a `<StoreContextProvider>`:

```jsx
import { StoreContextProvider, memoryStore } from 'ra-core';

test('<MyComponent>', async () => {
    const { getByText } = render(
        <StoreContextProvider value={memoryStore()}>
            <MyComponent />
        </StoreContextProvider>
    );
    const items = await screen.findAllByText(/Item #[0-9]: /);
    expect(items).toHaveLength(10);
})
```

## Testing Permissions

As explained on the [Auth Provider chapter](./Permissions.md), it's possible to manage permissions via the `authProvider` in order to filter page and fields the users can see.

In order to avoid regressions and make the design explicit to your co-workers, it's better to unit test which fields are supposed to be displayed or hidden for each permission.

Here is an example with Jest and TestingLibrary, which is testing the [`UserShow` page of the simple example](https://github.com/marmelab/react-admin/blob/master/examples/simple/src/users/UserShow.tsx).

```jsx
// UserShow.spec.js
import * as React from "react";
import { render, fireEvent } from '@testing-library/react';
import { CoreAdminContext } from 'ra-core';

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
                <CoreAdminContext dataProvider={dataProvider}>
                    <UserShow permissions="user" id="1" />
                </CoreAdminContext>
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
                <CoreAdminContext dataProvider={dataProvider}>
                    <UserShow permissions="user" id="1" />
                </CoreAdminContext>
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
                <CoreAdminContext dataProvider={dataProvider}>
                    <UserShow permissions="user" id="1" />
                </CoreAdminContext>
            );

            fireEvent.click(testUtils.getByText('Security'));
            expect(testUtils.queryByDisplayValue('admin')).not.toBeNull();
        });
    });
});
```
