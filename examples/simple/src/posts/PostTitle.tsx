import * as React from 'react';
import { useTranslate } from 'react-admin';

export default ({ record }) => {
    const translate = useTranslate();
    return (
        <span>
            {record
                ? translate('post.edit.title', { title: record.title })
                : ''}
        </span>
    );
};
