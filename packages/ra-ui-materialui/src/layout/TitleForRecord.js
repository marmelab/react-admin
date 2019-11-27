import React from 'react';
import PropTypes from 'prop-types';
import Title, { TitlePropType } from './Title';

const TitleForRecord = ({ defaultTitle, record, title }) =>
    record ? (
        <Title title={title} record={record} defaultTitle={defaultTitle} />
    ) : (
        ''
    );

TitleForRecord.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.object,
    title: TitlePropType,
};

export default TitleForRecord;
