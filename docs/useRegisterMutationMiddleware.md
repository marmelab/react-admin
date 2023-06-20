---
layout: default
title: "useRegisterMutationMiddleware"
---

# `useRegisterMutationMiddleware`

This hook allows to register a mutation middleware function.

Middleware functions allow you to hook into a mutation process to perform various actions before or after the main mutation action (create or update). They allow similar use cases as the [`withLifeCycleCallbacks`](./withLifecycleCallbacks.md) except they are declared at the component level.

**Tip** This hook will unregister the middleware function in its cleanup phase (for instance when the component that called it is unmounted).

## Usage

The following example shows how to implement a custom `<ImageInput>` that converts its images in base64 on submit and update the main resource record to use the base64 versions of those images:

```tsx
import { useCallback } from 'react';
import { ImageInput, ImageInputProps, Middleware, UseCreateResult, useRegisterMutationMiddleware } from 'react-admin';
import get from 'lodash/get';
import set from 'lodash/set';

const handleImageUpload = (
    source: string
): Middleware<UseCreateResult[0]> => async (
    resource,
    params,
    options,
    next
) => {
    const images = get(params?.data, source);

    if (Array.isArray(images)) {
        const newImages = await Promise.all(
            images.map(async image => {
                const b64 = await convertFileToBase64(image);
                return {
                    title: image.title,
                    src: b64,
                };
            })
        );
        const newData = set({ ...params?.data }, source, newImages);

        next(
            resource,
            {
                ...params,
                data: newData,
            },
            options
        );
        return;
    }

    const b64 = await convertFileToBase64(images);
    const newData = set({ ...params?.data }, source, {
        title: images.title,
        src: b64,
    });

    next(
        resource,
        {
            ...params,
            data: newData,
        },
        options
    );
};

const convertFileToBase64 = file =>
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

const MyImageInput = (props: Omit<ImageInputProps, 'children'>) => {
    const middleware = useCallback(handleImageUpload(props.source), [
        props.source,
    ]);

    useRegisterMutationMiddleware(middleware);

    return (
        <ImageInput {...props}>
            <ImageField source="src" title="title" />
        </ImageInput>
    );
};
```