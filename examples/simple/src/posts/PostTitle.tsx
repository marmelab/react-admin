import * as React from 'react';
import { TitleProps, useTranslate } from 'react-admin';

export default ({ record }: TitleProps) => {
    const translate = useTranslate();
    return (
        <span>
            {record
                ? translate('post.edit.title', { title: record.title })
                : ''}
        </span>
    );
};
