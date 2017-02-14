const convertFileToBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
});

const addUploadCapabilities = requestHandler => (type, resource, params) => {
    if (type === 'UPDATE' && resource === 'posts') {
        if (params.data.pictures && params.data.pictures.length) {
            return Promise.all(params.data.pictures.map(convertFileToBase64))
                .then(base64Pictures => requestHandler(type, resource, {
                    ...params,
                    data: {
                        ...params.data,
                        pictures: base64Pictures.map((base64, index) => ({
                            src: base64,
                            title: `${params.data.title} - Photo ${index}`,
                        })),
                    },
                }));
        }
    }

    return requestHandler(type, resource, params);
};

export default addUploadCapabilities;
