import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';

import translate from '../../i18n/translate';
import { UPDATE } from '../../dataFetchActions';
import BulkAction from './BulkAction';
import { connect } from 'react-redux';
import { crudExecuteBulkAction } from '../../actions/dataActions';

const BulkActionCustom = ({ translate, label, ...props }) => (
    <BulkAction cacheAction={UPDATE} keepSelectionFailed {...props}>
        {translate(label)}
    </BulkAction>
);
BulkActionCustom.propTypes = {
    translate: PropTypes.func,
    label: PropTypes.string.isRequired,
};
const enhance = compose(
    translate,
    connect(null, { onExecuteAction: crudExecuteBulkAction })
);

export default enhance(BulkActionCustom);
