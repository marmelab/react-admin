---
layout: default
title: "Unit Testing"
---

# Unit Testing

By default, react-admin acts as a declarative admin configuration: list some resources, define their controllers and, plug some built-in components or your own to define their fields or inputs.

Thus, unit testing isn't really needed nor recommended at first, because the internal API of the framework is already tested by its maintainers and each custom component can be tested by its own by mocking react-admin. ([see how to do so with Jest](https://jestjs.io/docs/en/manual-mocks#mocking-node-modules))

On the contrary, it is recommended to write end-to-end tests to secure your most common scenario at least.

That being said, there are still some cases, listed below, where a unit test can be useful.

## Testing Custom Views

One issue you may run into when attempting to render custom `Create` or `Edit` views is that you need to provide the component with the expected props contained within the react-admin redux store.

Luckily, react-admin provides access to a `TestContext` wrapper component that can be used to initialise your component with many of the expected react-admin props:

```jsx
import React from 'react';
import { TestContext } from 'ra-core';
import { mount } from 'enzyme';
import MyCustomEditView from './my-custom-edit-view';

describe('MyCustomEditView', () => {
    let myCustomEditView;

    beforeEach(() => {
        const defaultEditProps = {
            basePath: '/',
            id: '123',
            resource: 'foo',
            location: {},
            match: {},
        };

        myCustomEditView = mount(
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

## Enabling reducers to ensure actions are dispatched

If you component relies on a a reducer, e.g. redux-form submission, you can enable reducers using the `enableReducers` prop:

```jsx
myCustomEditView = mount(
    <TestContext enableReducers>
        <MyCustomEditView />
    </TestContext>
);
```

This means that reducers will work as they will within the app.  For example, you can now submit a form and redux-form will cause a re-render of your component.


## Spying on the store 'dispatch'

If you are using `mapDispatch` within connected components, it is likely you will want to test that actions have been dispatched with the correct arguments.  You can return the `store` being used within the tests using a `renderProp`.

```jsx
let dispatchSpy;
myCustomEditView = mount(
    <TestContext>
        {({ store }) => {
            dispatchSpy = jest.spyOn(store, 'dispatch');
            return <MyCustomEditView />
        }}
    </TestContext>,
);

it('should send the user to another url', () => {
    myCustomEditView.find('.next-button').simulate('click');
    expect(dispatchSpy).toHaveBeenCalledWith(`/next-url`);
});
```


## Testing Permissions

As explained on the [Authorization page](./Authorization.md), it's possible to manage permissions via the authentication provider in order to filter page and fields the users can see.

In order to avoid regressions and make the design explicit to your co-workers, it's better to unit test which fields is supposed to be displayed or hidden for each permission.

Here is an example with Jest and Enzyme, which is testing the [User `show` page of the simple example](https://github.com/marmelab/react-admin/blob/master/examples/simple/src/users/UserShow.js).

```jsx
// UserShow.spec.js
import React from 'react';
import { shallow } from 'enzyme';
import { Tab, TextField } from 'react-admin';

import UserShow from './UserShow';

describe('UserShow', () => {
    describe('As User', () => {
        it('should display one tab', () => {
            const wrapper = shallow(<UserShow permissions="user" />);

            const tab = wrapper.find(Tab);
            expect(tab.length).toBe(1);
        });

        it('should show the user identity in the first tab', () => {
            const wrapper = shallow(<UserShow permissions="user" />);

            const tab = wrapper.find(Tab);
            const fields = tab.find(TextField);

            expect(fields.at(0).prop('source')).toBe('id');
            expect(fields.at(1).prop('source')).toBe('name');
        });
    });

    describe('As Admin', () => {
        it('should display two tabs', () => {
            const wrapper = shallow(<UserShow permissions="admin" />);

            const tabs = wrapper.find(Tab);
            expect(tabs.length).toBe(2);
        });

        it('should show the user identity in the first tab', () => {
            const wrapper = shallow(<UserShow permissions="admin" />);

            const tabs = wrapper.find(Tab);
            const fields = tabs.at(0).find(TextField);

            expect(fields.at(0).prop('source')).toBe('id');
            expect(fields.at(1).prop('source')).toBe('name');
        });

        it('should show the user role in the second tab', () => {
            const wrapper = shallow(<UserShow permissions="admin" />);

            const tabs = wrapper.find(Tab);
            const fields = tabs.at(1).find(TextField);

            expect(fields.at(0).prop('source')).toBe('role');
        });
    });
});
```
