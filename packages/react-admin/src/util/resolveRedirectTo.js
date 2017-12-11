import linkToRecord from './linkToRecord';

export default (redirectTo, basePath, id) => {
    switch (redirectTo) {
        case 'list':
            return basePath;
        case 'create':
            return `${basePath}/create`;
        case 'edit':
            return linkToRecord(basePath, id);
        case 'show':
            return `${linkToRecord(basePath, id)}/show`;
        default:
            return redirectTo;
    }
};
