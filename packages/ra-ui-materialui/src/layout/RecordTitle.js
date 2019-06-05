import React from 'react';
import PropTypes from 'prop-types';
import TitleDeprecated from './TitleDeprecated';

/**
 * @deprecated Use TitleForRecord instead
 */
const RecordTitle = ({ defaultTitle, record, title }) =>
    record ? <TitleDeprecated title={title} record={record} defaultTitle={defaultTitle} /> : '';

RecordTitle.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.object,
    title: PropTypes.any,
};

export default RecordTitle;
