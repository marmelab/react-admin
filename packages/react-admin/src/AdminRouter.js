import { CoreAdminRouter } from 'react-admin-core';
import Loading from './mui/layout/Loading';

const AdminRouter = CoreAdminRouter;

AdminRouter.defaultProps = {
    loading: Loading,
};
