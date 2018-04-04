import React from 'react';
import Avatar from 'material-ui/Avatar';

const style = { verticalAlign: 'middle' };
const AvatarField = ({ record, size }) => (
    <Avatar
        src={`${record.avatar}?size=${size}x${size}`}
        size={size}
        style={style}
    />
);

AvatarField.defaultProps = {
    size: 25,
};

export default AvatarField;
