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

