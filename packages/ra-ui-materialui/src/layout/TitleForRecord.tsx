import React, { FC } from 'react';
import PropTypes from 'prop-types';
import Title, { TitlePropType, TitleProps } from './Title';

interface Props extends TitleProps {
    record: TitleProps['record'];
}

const TitleForRecord: FC<Props> = props =>
    props.record ? <Title {...props} /> : null;

TitleForRecord.propTypes = {
    defaultTitle: PropTypes.any,
    record: PropTypes.object,
    title: TitlePropType,
};

export default TitleForRecord;
