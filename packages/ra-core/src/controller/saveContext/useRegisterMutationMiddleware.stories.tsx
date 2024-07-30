import * as React from 'react';
import { useCallback } from 'react';
import {
    AdminContext,
    Create,
    DataProvider,
    ImageField,
    ImageInput,
    ImageInputProps,
    Middleware,
    SimpleForm,
    useRegisterMutationMiddleware,
} from 'react-admin';
import get from 'lodash/get';
import set from 'lodash/set';
import fakerestDataProvider from 'ra-data-fakerest';

export default {
    title: 'ra-core/form/useRegisterMutationMiddleware',
};

const handleImageUpload =
    (source: string): Middleware<DataProvider['create']> =>
    async (resource, params, next) => {
        console.log('ORIGINAL DATA', params?.data);
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

            return next(resource, {
                ...params,
                data: newData,
            });
        }

        const b64 = await convertFileToBase64(images);
        const newData = set({ ...params?.data }, source, {
            title: images.title,
            src: b64,
        });

        return next(resource, {
            ...params,
            data: newData,
        });
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
    const middleware = useCallback<Middleware<DataProvider['create']>>(
        (resource, params, next) =>
            handleImageUpload(props.source)(resource, params, next),
        [props.source]
    );

    useRegisterMutationMiddleware(middleware);

    return (
        <ImageInput {...props}>
            <ImageField source="src" title="title" />
        </ImageInput>
    );
};

export const Basic = () => {
    const dataProvider = fakerestDataProvider(
        {
            posts: [],
        },
        true
    );
    return (
        <AdminContext dataProvider={dataProvider} defaultTheme="light">
            <Create resource="posts">
                <SimpleForm>
                    <MyImageInput source="thumbnail" />
                </SimpleForm>
            </Create>
        </AdminContext>
    );
};

export const Multiple = () => {
    const dataProvider = fakerestDataProvider(
        {
            posts: [],
        },
        true
    );
    return (
        <AdminContext dataProvider={dataProvider} defaultTheme="light">
            <Create resource="posts">
                <SimpleForm>
                    <MyImageInput source="thumbnail" multiple />
                </SimpleForm>
            </Create>
        </AdminContext>
    );
};
