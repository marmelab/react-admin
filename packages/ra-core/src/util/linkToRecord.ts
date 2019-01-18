export default (basePath, id, linkType = 'edit') => {
    const link = `${basePath}/${encodeURIComponent(id)}`;

    if (linkType === 'show') {
        return `${link}/show`;
    }

    return link;
};
