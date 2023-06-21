---
layout: default
title: "useRegisterMutationMiddleware"
---

# `useRegisterMutationMiddleware`

This hook allows to register a mutation middleware function.

Middleware functions allow you to hook into a mutation process to perform various actions before or after the main mutation action (create or update), or even alter the main mutation parameters. They allow similar use cases as the [`withLifeCycleCallbacks`](./withLifecycleCallbacks.md) except they are declared at the component level such as:

- adding performances logs;
- transforming the data passed to the main mutation;
- create, update or delete related data (audit logs, etc.).

Middleware functions are functions that have access to the same parameters than the underlying mutation (create or update) and a `next` function in the mutation lifecycle.

For instance, here's a middleware function for the create mutation:

```tsx
const createMiddleware = (
    resource: string,
    params: CreateParams,
    options: MutateOptions,
    next: CreateMutationFunction
) => {
    // Do something before the mutation

    // Call the next middleware
    next(resource, params, options);

    // Do something after the mutation
}
```

**Tip** This hook will unregister the middleware function in its cleanup phase (for instance when the component that called unmounts). For this to work correctly, you must provide a stable reference to the function by wrapping it in a `useCallback` hook for instance.

## Usage

The following example shows how to implement a custom `<ImageInput>` that converts its images in base64 on submit and update the main resource record to use the base64 versions of those images:

```tsx
import { useCallback } from 'react';
import { CreateMutationFunction, ImageInput, ImageInputProps, Middleware, useRegisterMutationMiddleware } from 'react-admin';

const handleImageUpload: Middleware<CreateMutationFunction> => async (
    resource,
    params,
    options,
    next
) => {
    const b64 = await convertFileToBase64(params.data.thumbnail);
    // Update the parameters that will be sent to the dataProvider call
    const newParams = { ...params, data: { ...data, thumbnail: b64 } };
    next(resource, newParams, options);
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

const ThumbnailInput = (props: ImageInputProps) => {
    const middleware = useCallback(handleImageUpload(props.source), [
        props.source,
    ]);

    useRegisterMutationMiddleware(middleware);

    return (
        <ImageInput {...props} source="thumbnail" />
    );
};
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