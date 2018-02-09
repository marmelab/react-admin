export default (basePath, id, linkType = 'edit') => {
    let link = `${basePath}/${encodeURIComponent(id)}`;

    if (linkType === 'show') {
        return `${link}/show`;
    }

    return link;
};
