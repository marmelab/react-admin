# ra-test

Test utilities for react-admin, a frontend Framework for building admin applications on top of REST services, using ES6, React.

By default, react-admin acts as a declarative admin configuration: list some resources, define their controllers, and,plug some built-in components or your own to define their fields or inputs.

Thus, unit testing isn't really needed nor recommended at first, because the internal API of the framework is already tested by its maintainers and each custom component can be tested on its own by mocking react-admin. ([see how to do so with Jest](https://jestjs.io/docs/en/manual-mocks#mocking-node-modules))

However, it is recommended to write end-to-end tests to secure your most common scenario at least.

That being said, there are still some cases, listed below, where a unit test can be useful.

## Usage

### Testing Custom Views

One issue you may run into when attempting to render custom `Create` or `Edit` views is that you need to provide the component with the expected props contained within the react-admin redux store.

Luckily, the `ra-test` package provides access to a `TestContext` wrapper component that can be used to initialise your component with many of the expected react-admin props:

```jsx
import * as React from "react";
import { TestContext } from 'ra-test';
import { render } from '@testing-library/react';
import MyCustomEditView from './my-custom-edit-view';

describe('MyCustomEditView', () => {
    let testUtils;

    beforeEach(() => {
        const defaultEditProps = {
            basePath: '/',
            id: '123',
            resource: 'foo',
            location: {},
            match: {},
        };

        testUtils = render(
            <TestContext>
                <MyCustomEditView {...defaultEditProps} />
            </TestContext>
        );
    });

    // Tests
});
```

You can then provide additional props, as needed, to your component (such as the `defaultEditProps` provided above).

At this point, your component should `mount` without errors and you can unit test your component.

### Enabling reducers to ensure actions are dispatched

If your component relies on a reducer, you can enable reducers using the `enableReducers` prop:

```jsx
testUtils = render(
    <TestContext enableReducers>
        <MyCustomEditView />
    </TestContext>
);
```

This means that reducers will work as they will within the app.

### Passing your custom reducers

If your component relies on customReducers which are passed originally to the `<Admin/>` component, you can plug them in the TestContext using the `customReducers` props:

```jsx
testUtils = render(
    <TestContext enableReducers customReducers={myCustomReducers}>
        <MyCustomEditView />
    </TestContext>
);
```

Note you should also enable the default react-admin reducers in order to supply the custom ones. 

### Spying on the store 'dispatch'

If you are using `useDispatch` within your components, it is likely you will want to test that actions have been dispatched with the correct arguments. You can return the `store` being used within the tests using a `renderProp`.

```jsx
let dispatchSpy;
testUtils = render(
    <TestContext>
        {({ store }) => {
            dispatchSpy = jest.spyOn(store, 'dispatch');
            return <MyCustomEditView />
        }}
    </TestContext>,
);

it('should send the user to another url', () => {
    fireEvent.click(testUtils.getByText('Go to next'));
    expect(dispatchSpy).toHaveBeenCalledWith(`/next-url`);
});
```

### Using the 'renderWithRedux' wrapper function

Instead of wrapping the component under test with the `TestContext` by yourself you can use all of the above options and test your components almost like using just `@testing-library/react` thanks to the `renderWithRedux` wrapper function.

It will return the same output as the `render` method from `@testing-library/react` but will add the `dispatch` and `reduxStore` helpers.

```jsx
import { defaultStore } from 'ra-test';
//...
const { dispatch, reduxStore, ...testUtils } = renderWithRedux(
    <MyCustomEditView />, 
    initialState, 
    options,
    myCustomReducers
);

it('should initilize store', () => {
    const storeState = reduxStore.getState();
    storeState.router.location.key = ''
    expect(storeState).toEqual({...defaultStore, ...initialState});
});

it('should send the user to another url', () => {
    fireEvent.click(testUtils.getByText('Go to next'));
    expect(dispatch).toHaveBeenCalledWith(`/next-url`);
});
```

All of the arguments except the first one - the component under test, are optional and could be omitted by passing an empty object - `{}`

### Testing Permissions

As explained on the [Auth Provider chapter](https://marmelab.com/react-admin/Authentication.html#authorization), it's possible to manage permissions via the `authProvider` in order to filter page and fields the users can see.

In order to avoid regressions and make the design explicit to your co-workers, it's better to unit test which fields are supposed to be displayed or hidden for each permission.

Here is an example with Jest and TestingLibrary, which is testing the [`UserShow` page of the simple example](https://github.com/marmelab/react-admin/blob/master/examples/simple/src/users/UserShow.js).

```jsx
// UserShow.spec.js
import * as React from "react";
import { render } from '@testing-library/react';
import { Tab, TextField } from 'react-admin';

import UserShow from './UserShow';

describe('UserShow', () => {
    describe('As User', () => {
        it('should display one tab', () => {
            const testUtils = render(<UserShow permissions="user" />);

            const tabs = testUtils.queryByRole('tab');
            expect(tabs.length).toEqual(1);
        });

        it('should show the user identity in the first tab', () => {
            const dataProvider = {
                getOne: jest.fn().resolve({
                    id: 1,
                    name: 'Leila'
                })
            }
            const testUtils = render(
                <TestContext>
                    <UserShow permissions="user" id="1" />
                </TestContext>
            );

            expect(testUtils.queryByDisplayValue('1')).not.toBeNull();
            expect(testUtils.queryByDisplayValue('Leila')).not.toBeNull();
        });
    });

    describe('As Admin', () => {
        it('should display two tabs', () => {
            const testUtils = render(<UserShow permissions="user" />);

            const tabs = testUtils.queryByRole('tab');
            expect(tabs.length).toEqual(2);
        });

        it('should show the user identity in the first tab', () => {
            const dataProvider = {
                getOne: jest.fn().resolve({
                    id: 1,
                    name: 'Leila'
                })
            }
            const testUtils = render(
                <TestContext>
                    <UserShow permissions="user" id="1" />
                </TestContext>
            );

            expect(testUtils.queryByDisplayValue('1')).not.toBeNull();
            expect(testUtils.queryByDisplayValue('Leila')).not.toBeNull();
        });

        it('should show the user role in the second tab', () => {
            const dataProvider = {
                getOne: jest.fn().resolve({
                    id: 1,
                    name: 'Leila',
                    role: 'admin'
                })
            }
            const testUtils = render(
                <TestContext>
                    <UserShow permissions="user" id="1" />
                </TestContext>
            );

            fireEvent.click(testUtils.getByText('Security'));
            expect(testUtils.queryByDisplayValue('admin')).not.toBeNull();
        });
    });
});
```
