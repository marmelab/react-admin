import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Title, { TitlePropType, TitleProps } from './Title';

const TitleForRecord: FC<Props> = ({
    defaultTitle,
    record,
    title,
    className,
}) =>
    record ? (
        <Title
            title={title}
            record={record}
            defaultTitle={defaultTitle}
            className={className}
        />
    ) : null;

interface Props extends TitleProps {
    record: TitleProps['record'];
}

TitleForRecord.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.object,
    title: TitlePropType,
};

export default TitleForRecord;
