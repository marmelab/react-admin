import React from 'react';
import PropTypes from 'prop-types';
import Title from './Title';

const RecordTitle = ({ defaultTitle, record, title }) =>
    record ? (
        <Title title={title} record={record} defaultTitle={defaultTitle} />
    ) : (
        ''
    );

RecordTitle.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.object,
    title: PropTypes.any,
};

export default RecordTitle;
