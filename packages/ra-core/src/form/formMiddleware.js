import { LOCATION_CHANGE } from 'react-router-redux';
import { destroy } from 'redux-form';
import isEqual from 'lodash/isEqual';

import { resetForm } from '../actions/formActions';
import { REDUX_FORM_NAME } from '../form/constants';

let previousLocation;

/**
 * This middleware ensure that whenever a location change happen, we get the
 * chance to properly reset the redux-form record form, preventing data to be
 * kept between different resources or form types (CREATE, EDIT).
 *
 * A middleware is needed instead of a saga because we need to control the actions
 * order: we need to ensure we reset the redux form BEFORE the location actually
 * change. Otherwise, the new page which may contains a record redux-form might
 * initialize before our reset and loose its data.
 */
const formMiddleware = () => next => action => {
    if (
        action.type !== LOCATION_CHANGE ||
        (action.payload.state && action.payload.state.skipFormReset)
    ) {
        return next(action);
    }

    // history allows one to redirect to the same location which can happen
    // when using a special menu for a create page for instance. In this case,
    // we don't want to reset the form.
    // See https://github.com/marmelab/react-admin/issues/2291
    if (isEqual(action.payload, previousLocation)) {
        return next(action);
    }

    previousLocation = action.payload;
    next(resetForm());
    next(destroy(REDUX_FORM_NAME));
    return next(action);
};

export default formMiddleware;
