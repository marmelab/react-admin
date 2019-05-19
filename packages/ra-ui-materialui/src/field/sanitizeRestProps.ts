import omit from 'lodash/omit';

export default (props: object): object =>
    omit(props, [
        'addLabel',
        'allowEmpty',
        'basePath',
        'cellClassName',
        'className',
        'formClassName',
        'headerClassName',
        'label',
        'linkType',
        'locale',
        'record',
        'resource',
        'sortable',
        'sortBy',
        'source',
        'textAlign',
        'translateChoice',
    ]);
