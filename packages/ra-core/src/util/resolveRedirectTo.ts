import linkToRecord from './linkToRecord';

export default (redirectTo, basePath: string, id?, data?) => {
    if (typeof redirectTo === 'function') {
        return redirectTo(basePath, id, data);
    }
    switch (redirectTo) {
        case 'list':
            return basePath;
        case 'create':
            return `${basePath}/create`;
        case 'edit':
            return linkToRecord(basePath, id);
        case 'show':
            return linkToRecord(basePath, id, 'show');
        default:
            return redirectTo;
    }
};
