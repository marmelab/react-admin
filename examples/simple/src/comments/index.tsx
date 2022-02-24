import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CommentCreate from './CommentCreate';
import CommentEdit from './CommentEdit';
import CommentList from './CommentList';
import { ShowGuesser } from 'react-admin';

export default {
    list: CommentList,
    create: CommentCreate,
    edit: CommentEdit,
    show: ShowGuesser,
    icon: ChatBubbleIcon,
};
