import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Restricted from '../../auth/Restricted';
import NotFound from '../layout/NotFound';

const NotFoundWithPermission = ({ location }) => (
    <Restricted location={location}>
        <NotFound />
    </Restricted>
);

NotFoundWithPermission.propTypes = {
    location: PropTypes.object,
};

export default withRouter(NotFoundWithPermission);
