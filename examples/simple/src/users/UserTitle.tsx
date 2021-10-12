/* eslint react/jsx-key: off */
import * as React from 'react';
import { useTranslate, Record } from 'react-admin';

const UserTitle = ({ record }: { record?: Record }) => {
    const translate = useTranslate();
    return (
        <span>
            {record ? translate('user.edit.title', { title: record.name }) : ''}
        </span>
    );
};

export default UserTitle;
