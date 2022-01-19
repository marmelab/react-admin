/**
 * @deprecated use useCreatePath instead
 */
export const linkToRecord = (resource, id, linkType = 'edit') => {
    const link = `${resource}/${encodeURIComponent(id)}`;

    if (linkType === 'show') {
        return `${link}/show`;
    }

    return link;
};
