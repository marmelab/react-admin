import PeopleIcon from '@mui/icons-material/People';
import UserCreate from './UserCreate';
import UserEdit from './UserEdit';
import UserList from './UserList';
import UserShow from './UserShow';
import type { User } from '../types';

export default {
    list: UserList,
    create: UserCreate,
    edit: UserEdit,
    show: UserShow,
    icon: PeopleIcon,
    recordRepresentation: (record: User) => `${record.name} (${record.role})`,
};
