import React from 'react';
import { withRouter } from 'react-router-dom';
import Restricted from '../../auth/Restricted';
import NotFound from '../layout/NotFound';

const NotFoundWithPermission = ({ location }) => (
    <Restricted location={location} >
        <NotFound />
    </Restricted>
);

export default withRouter(NotFoundWithPermission);