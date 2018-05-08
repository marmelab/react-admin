import React from 'react';
import { translate } from 'react-admin';

export default translate(({ record, translate }) => (
    <span>
        {record ? translate('post.edit.title', { title: record.title }) : ''}
    </span>
));
