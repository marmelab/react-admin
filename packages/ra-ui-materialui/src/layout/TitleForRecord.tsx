import React, { FC, Fragment } from 'react';
import PropTypes from 'prop-types';
import Title, { TitleProps, TitlePropType } from './Title';

const TitleForRecord: FC<TitleForRecordProps> = ({
    defaultTitle,
    record,
    title,
}) =>
    record ? (
        <Title title={title} record={record} defaultTitle={defaultTitle} />
    ) : (
        <Fragment />
    );

export type TitleForRecordProps = Pick<
    TitleProps,
    'defaultTitle' | 'record' | 'title'
>;

TitleForRecord.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.any,
    title: TitlePropType,
};

export default TitleForRecord;
