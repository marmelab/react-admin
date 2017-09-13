import React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import { Link } from 'react-router-dom';

const tertiaryStyle = { float: 'right', opacity: 0.541176 };

const SimpleList = ({
    ids,
    data,
    basePath,
    primaryText,
    secondaryText,
    secondaryTextLines,
    tertiaryText,
    leftAvatar,
    leftIcon,
    rightAvatar,
    rightIcon,
}) => (
    <List>
        {ids.map(id => (
            <ListItem
                key={id}
                primaryText={
                    <div>
                        {primaryText(data[id], id)}
                        {tertiaryText && (
                            <span style={tertiaryStyle}>
                                {tertiaryText(data[id], id)}
                            </span>
                        )}
                    </div>
                }
                secondaryText={secondaryText && secondaryText(data[id], id)}
                secondaryTextLines={secondaryTextLines}
                leftAvatar={leftAvatar && leftAvatar(data[id], id)}
                leftIcon={leftIcon && leftIcon(data[id], id)}
                rightAvatar={rightAvatar && rightAvatar(data[id], id)}
                rightIcon={rightIcon && rightIcon(data[id], id)}
                containerElement={<Link to={`${basePath}/${id}`} />}
            />
        ))}
    </List>
);

SimpleList.propTypes = {
    ids: PropTypes.array,
    data: PropTypes.object,
    basePath: PropTypes.string,
    primaryText: PropTypes.func,
    secondaryText: PropTypes.func,
    secondaryTextLines: PropTypes.number,
    tertiaryText: PropTypes.func,
    leftAvatar: PropTypes.func,
    leftIcon: PropTypes.func,
    rightAvatar: PropTypes.func,
    rightIcon: PropTypes.func,
};

export default SimpleList;
