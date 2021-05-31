import * as React from 'react';
import { useTranslate, TitleProps, useDocumentTitle } from 'react-admin';

export default ({ record }: TitleProps) => {
    const translate = useTranslate();
    const title = translate('post.edit.title', { title: record?.title ?? '' });

    useDocumentTitle(title);

    return <span>{record ? title : ''}</span>;
};
