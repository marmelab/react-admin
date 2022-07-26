import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CommentCreate from './CommentCreate';
import CommentEdit from './CommentEdit';
import CommentList from './CommentList';
import CommentShow from './CommentShow';
import { ListGuesser } from 'react-admin';

export default {
    list: ListGuesser,
    create: CommentCreate,
    edit: CommentEdit,
    show: CommentShow,
    icon: ChatBubbleIcon,
};
