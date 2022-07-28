import PeopleIcon from '@mui/icons-material/People';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserList from './UserList';
import UserShow from './UserShow';

export default {
    list: UserList,
    create: UserCreate,
    edit: UserEdit,
    show: UserShow,
    icon: PeopleIcon,
    recordRepresentation: record => `${record.name} (${record.role})`,
};
