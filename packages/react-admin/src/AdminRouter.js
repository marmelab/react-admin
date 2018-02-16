import { CoreAdminRouter } from 'ra-core';
import Loading from './mui/layout/Loading';

const AdminRouter = CoreAdminRouter;

AdminRouter.defaultProps = {
    loading: Loading,
};
