import omit from 'lodash/omit';

export default (props: object): object =>
    omit(props, [
        'addLabel',
        'allowEmpty',
        'basePath',
        'cellClassName',
        'className',
        'emptyText',
        'formClassName',
        'headerClassName',
        'label',
        'linkType',
        'link',
        'locale',
        'record',
        'resource',
        'sortable',
        'sortBy',
        'source',
        'textAlign',
        'translateChoice',
    ]);
