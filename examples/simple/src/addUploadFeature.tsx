import type { DataProvider, UpdateParams } from 'react-admin';
import type { Picture, Post } from './types';

const isNewPicture = (p: Picture): p is Picture & { rawFile: File } =>
    p.rawFile instanceof File;

/**
 * For posts update only, convert uploaded image in base 64 and attach it to
 * the `picture` sent property, with `src` and `title` attributes.
 */
const addUploadCapabilities = (dataProvider: DataProvider): DataProvider => ({
    ...dataProvider,
    update: (resource: string, params: UpdateParams<Post>) => {
        if (resource !== 'posts' || !params.data.pictures) {
            // fallback to the default implementation
            return dataProvider.update(resource, params);
        }
        // The posts edition form uses a file upload widget for the pictures field.
        // Freshly dropped pictures are File objects
        // and must be converted to base64 strings
        const newPictures = params.data.pictures.filter(isNewPicture);
        const formerPictures = params.data.pictures.filter(
            p => !isNewPicture(p)
        );

        return Promise.all(newPictures.map(convertFileToBase64))
            .then(base64Pictures =>
                base64Pictures.map(picture64 => ({
                    src: picture64,
                    title: `${params.data.title}`,
                }))
            )
            .then(transformedNewPictures =>
                dataProvider.update(resource, {
                    ...params,
                    data: {
                        ...params.data,
                        pictures: [
                            ...transformedNewPictures,
                            ...formerPictures,
                        ],
                    },
                })
            );
    },
});

/**
 * Convert a `File` object returned by the upload input into a base 64 string.
 * That's not the most optimized way to store images in production, but it's
 * enough to illustrate the idea of data provider decoration.
 */
const convertFileToBase64 = (file: Picture & { rawFile: File }) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.rawFile);

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

export default addUploadCapabilities;
