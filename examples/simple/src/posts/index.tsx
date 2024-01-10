import BookIcon from '@mui/icons-material/Book';
import PostCreate from './PostCreate';
import PostEdit from './PostEdit';
import PostList from './PostList';
import PostShow from './PostShow';

export default {
    list: PostList,
    create: PostCreate,
    edit: PostEdit,
    show: PostShow,
    icon: BookIcon,
    recordRepresentation: 'title',
};
