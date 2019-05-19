import React from 'react';
import Avatar from '@material-ui/core/Avatar';

const AvatarField = ({ record, size, className }) => (
    <Avatar
        src={`${record.avatar}?size=${size}x${size}`}
        size={size}
        style={{ width: size, height: size }}
        className={className}
    />
);

AvatarField.defaultProps = {
    size: 25,
};

export default AvatarField;
