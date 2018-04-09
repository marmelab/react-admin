import { CoreAdminRouter } from '@yeutech/ra-core';
import { Loading } from '@yeutech/ra-ui-materialui';

const AdminRouter = CoreAdminRouter;

AdminRouter.defaultProps = {
    loading: Loading,
};

export default AdminRouter;
