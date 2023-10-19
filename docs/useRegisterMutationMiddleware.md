---
layout: default
title: "useRegisterMutationMiddleware"
---

# `useRegisterMutationMiddleware`

React-admin lets you hook into the save logic of the forms in Creation and Edition pages using middleware functions. These functions "wrap" the main mutation (`dataProvider.create()` in a Creation page, `dataProvider.update()` in an Edition page), so you can add your own code to be executed before and after it. This allows you to perform various advanced form use cases, such as:

- transforming the data passed to the main mutation,
- updating the mutation parameters before it is called,
- creating, updating or deleting related data,
- adding performances logs,
- etc.

Middleware functions have access to the same parameters as the underlying mutation (`create` or `update`), and to a `next` function to call the next function in the mutation lifecycle.

`useRegisterMutationMiddleware` allows to register a mutation middleware function for the current form.

## Usage

Define a middleware function, then use the hook to register it. 

For example, a middleware for the create mutation looks like the following:

```tsx
import * as React from 'react';
import {
    useRegisterMutationMiddleware,
    CreateParams,
    MutateOptions,
    CreateMutationFunction
} from 'react-admin';

const MyComponent = () => {
    const createMiddleware = async (
        resource: string,
        params: CreateParams,
        options: MutateOptions,
        next: CreateMutationFunction
    ) => {
        // Do something before the mutation

        // Call the next middleware
        await next(resource, params, options);

        // Do something after the mutation
    }
    const memoizedMiddleWare = React.useCallback(createMiddleware, []);
    useRegisterMutationMiddleware(memoizedMiddleWare);
    // ...
}
```

Then, render that component as a descendent of the page controller component (`<Create>` or `<Edit>`).

React-admin will wrap each call to the `dataProvider.create()` mutation with the `createMiddleware` function as long as the `MyComponent` component is mounted.

`useRegisterMutationMiddleware` unregisters the middleware function when the component unmounts. For this to work correctly, you must provide a stable reference to the function by wrapping it in a `useCallback` hook for instance.

## Params

`useRegisterMutationMiddleware` expects a single parameter: a middleware function.

A middleware function must have the following signature:

```jsx
const middlware = async (resource, params, options, next) => {
    // Do something before the mutation

    // Call the next middleware
    await next(resource, params, options);

    // Do something after the mutation
}
```

The `params` type depends on the mutation:

- For a `create` middleware, `{ data, meta }`
- For an `update` middleware, `{ id, data, previousData }`

## Example

The following example shows a custom `<ImageInput>` that converts its images to base64 on submit, and updates the main resource record to use the base64 versions of those images:

```tsx
import { useCallback } from 'react';
import { 
    CreateMutationFunction,
    ImageInput,
    Middleware,
    useRegisterMutationMiddleware
} from 'react-admin';

const ThumbnailInput = () => {
    const middleware = useCallback(async (
        resource,
        params,
        options,
        next
    ) => {
        const b64 = await convertFileToBase64(params.data.thumbnail);
        // Update the parameters that will be sent to the dataProvider call
        const newParams = { ...params, data: { ...data, thumbnail: b64 } };
        await next(resource, newParams, options);
    }, []);
    useRegisterMutationMiddleware(middleware);

    return <ImageInput source="thumbnail" />;
};

const convertFileToBase64 = (file: {
    rawFile: File;
    src: string;
    title: string;
}) =>
    new Promise((resolve, reject) => {
        // If the file src is a blob url, it must be converted to b64.
        if (file.src.startsWith('blob:')) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;

            reader.readAsDataURL(file.rawFile);
        } else {
            resolve(file.src);
        }
    });
```

Use the `<ThumbnailInput>` component in a creation form just like any regular Input component:

```jsx
const PostCreate = () => (
    <Create>
        <SimpleForm>
            <TextInput source="title" />
            <TextInput source="body" multiline />
            <ThumbnailInput />
        </SimpleForm>
    </Create>
);
```

With this middleware, given the following form values:

```json
{
    "data": {
        "thumbnail": {
            "rawFile": {
                "path": "avatar.jpg"
            },
            "src": "blob:http://localhost:9010/c925dc18-5918-4782-8087-b2464896b8f9",
            "title": "avatar.jpg"
        }
    }
}
```

The dataProvider `create` function will be called with:

```json
{
    "data": {
        "thumbnail": {
            "title":"avatar.jpg",
            "src":"data:image/jpeg;base64,..."
        }
    }
}
```
