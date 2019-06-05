import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title';

const TitleForRecord = ({ defaultTitle, record, title }) =>
    record ? <Title title={title} record={record} defaultTitle={defaultTitle} /> : '';

TitleForRecord.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.object,
    title: PropTypes.any,
};

export default TitleForRecord;
