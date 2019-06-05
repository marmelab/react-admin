const convertFileToBase64 = file =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.rawFile);

        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

const addUploadCapabilities = requestHandler => (type, resource, params) => {
    if (type === 'UPDATE' && resource === 'posts') {
        if (params.data.pictures && params.data.pictures.length) {
            // only freshly dropped pictures are instance of File
            const formerPictures = params.data.pictures.filter(p => !(p.rawFile instanceof File));
            const newPictures = params.data.pictures.filter(p => p.rawFile instanceof File);

            return Promise.all(newPictures.map(convertFileToBase64))
                .then(base64Pictures =>
                    base64Pictures.map(picture64 => ({
                        src: picture64,
                        title: `${params.data.title}`,
                    }))
                )
                .then(transformedNewPictures =>
                    requestHandler(type, resource, {
                        ...params,
                        data: {
                            ...params.data,
                            pictures: [...transformedNewPictures, ...formerPictures],
                        },
                    })
                );
        }
    }

    return requestHandler(type, resource, params);
};

export default addUploadCapabilities;
