import React from 'react';
import PropTypes from 'prop-types';
import onlyUpdateForKeys from 'recompose/onlyUpdateForKeys';
import compose from 'recompose/compose';
import translate from '../../i18n/translate';

const Title = ({ defaultTitle, record, title, translate }) => {
    if (!title) {
        return <span>{defaultTitle}</span>;
    }
    if (typeof title === 'string') {
        return <span>{translate(title, { _: title })}</span>;
    }
    return React.cloneElement(title, { record });
};

Title.propTypes = {
    defaultTitle: PropTypes.string.isRequired,
    record: PropTypes.object,
    translate: PropTypes.func.isRequired,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

const enhance = compose(
    translate,
    onlyUpdateForKeys('defaultTitle', 'record', 'title')
);

export default enhance(Title);
