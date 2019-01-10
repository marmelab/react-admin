---
layout: default
title: "Unit Testing"
---

# Unit Testing

## Testing custom create and edit views

When creating your customised create and edit views you may want to unit test those views.

One issue you may run into when attempting to render your component via enzyme, is that you need to provide the component with the expected props contained within the react-admin redux store.

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

```jsx harmony
    myCustomEditView = mount(
        <TestContext enableReducers>
            <MyCustomEditView />
        </TestContext>
    );
```

This means that reducers will work as they will within the app.  For example, you can now submit a form and redux-form will cause a re-render of your component.


## Spying on the store 'dispatch'

If you are using `mapDispatch` within connected components, it is likely you will want to test that actions have been dispatched with the correct arguments.  You can return the `store` being used within the tests using a `renderProp`. 

```jsx harmony
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
