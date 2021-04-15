import * as React from 'react';
import { useTranslate, Record } from 'react-admin';

export default ({ record }: { record?: Record }) => {
    const translate = useTranslate();
    return (
        <span>
            {record
                ? translate('post.edit.title', { title: record.title })
                : ''}
        </span>
    );
};
