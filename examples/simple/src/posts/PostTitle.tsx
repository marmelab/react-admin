import * as React from 'react';
import { useTranslate, Record, useDocumentTitle } from 'react-admin';

export default ({ record }: { record?: Record }) => {
    const translate = useTranslate();
    const title = translate('post.edit.title', { title: record.title });

    useDocumentTitle(title);

    return <span>{record ? title : ''}</span>;
};
