import { defineMessages } from 'react-intl';
import englishMessages from '@yeutech/ra-language-intl/translation/en.json';

const simpleMessages = defineMessages({
  actionResetViews: {
    id: 'simple.action.resetViews',
    defaultMessage: 'Reset views',
  }
});

const resourcesMessages = defineMessages({
  postsName: {
    id: 'resources.posts.name',
    defaultMessage: '{smart_count, plural, one {Post} other {Posts}}'
  },
  postsFieldsAverageNote: {
    id: 'resources.posts.fields.average_note',
    defaultMessage: 'Average note'
  },
  postsFieldsBody: {
    id: 'resources.posts.fields.body',
    defaultMessage: 'Body'
  },
  postsFieldsComments: {
    id: 'resources.posts.fields.comments',
    defaultMessage: 'Comments'
  },
  postsFieldsCommentable: {
    id: 'resources.posts.fields.commentable',
    defaultMessage: 'Commentable'
  },
  postsFieldsCommentableShort: {
    id: 'resources.posts.fields.commentable_short',
    defaultMessage: 'Com.'
  },
  postsFieldsCreatedAt: {
    id: 'resources.posts.fields.created_at',
    defaultMessage: 'Created at'
  },
  postsFieldsNotifications: {
    id: 'resources.posts.fields.notifications',
    defaultMessage: 'Notifications recipients'
  },
  postsFieldsNbView: {
    id: 'resources.posts.fields.nb_view',
    defaultMessage: 'Nb views'
  },
  postsFieldsPassword: {
    id: 'resources.posts.fields.password',
    defaultMessage: 'Password (if protected post)'
  },
  postsFieldsPictures: {
    id: 'resources.posts.fields.pictures',
    defaultMessage: 'Related Pictures'
  },
  postsFieldsPublishedAt: {
    id: 'resources.posts.fields.published_at',
    defaultMessage: 'Published at'
  },
  postsFieldsTeaser: {
    id: 'resources.posts.fields.teaser',
    defaultMessage: 'Teaser'
  },
  postsFieldsTags: {
    id: 'resources.posts.fields.tags',
    defaultMessage: 'Tags'
  },
  postsFieldsTitle: {
    id: 'resources.posts.fields.title',
    defaultMessage: 'Title'
  },
  postsFieldsViews: {
    id: 'resources.posts.fields.views',
    defaultMessage: 'Views'
  },
  commentsName: {
    id: 'resources.comments.name',
    defaultMessage: '{smart_count, plural, one {Comment} other {Comments}}',
  },
  commentsFieldsBody: {
    id: 'resources.comments.fields.body',
    defaultMessage: 'Body'
  },
  commentsFieldsCreatedAt: {
    id: 'resources.comments.fields.created_at',
    defaultMessage: 'Created at'
  },
  commentsFieldsPostId: {
    id: 'resources.comments.fields.post_id',
    defaultMessage: 'Posts'
  },
  commentsFieldsAuthorName: {
    id: 'resources.comments.fields.author.name',
    defaultMessage: 'Author'
  },
  usersName: {
    id: 'resources.users.name',
    defaultMessage: '{smart_count, plural, one {User} other {Users}}'
  },
  usersFieldsId: {
    id: 'resources.users.fields.id',
    defaultMessage: 'Id'
  },
  usersFieldsName: {
    id: 'resources.users.fields.name',
    defaultMessage: 'Name'
  },
  usersFieldsRole: {
    id: 'resources.users.fields.role',
    defaultMessage: 'Role'
  }
});
const postMessages = defineMessages({
  listSearch: {
    id: 'post.list.search',
    defaultMessage: 'Search'
  },
  formSummary: {
    id: 'post.form.summary',
    defaultMessage: 'Summary'
  },
  formBody: {
    id: 'post.form.body',
    defaultMessage: 'Body'
  },
  formMiscellaneous: {
    id: 'post.form.miscellaneous',
    defaultMessage: 'Miscellaneous'
  },
  formComments: {
    id: 'post.form.comments',
    defaultMessage: 'Comments'
  },
  editTitle: {
    id: 'post.edit.title',
    defaultMessage: 'Post "{title}"'
  },
  actionSaveAndAdd: {
    id: 'post.action.save_and_add',
    defaultMessage: 'Save and Add'
  },
  actionSaveAndShow: {
    id: 'post.action.save_and_show',
    defaultMessage: 'Save and Show'
  }
});

const commentMessages = defineMessages({
  listAbout: {
    id: 'comment.list.about',
    defaultMessage: 'About',
  },
});

const userMessages = defineMessages({
  listSearch: {
    id: 'user.list.search',
    defaultMessage: 'Search'
  },
  formSummary: {
    id: 'user.form.summary',
    defaultMessage: 'Summary'
  },
  formSecurity: {
    id: 'user.form.security',
    defaultMessage: 'Security'
  },
  editTitle: {
    id: 'user.edit.title',
    defaultMessage: 'User "{title}"'
  },
  actionSaveAndAdd: {
    id: 'user.action.save_and_add',
    defaultMessage: 'Save and Add'
  },
  actionSaveAndShow: {
    id: 'user.action.save_and_show',
    defaultMessage: 'Save and Show'
  }
});

// we just convert quickly the file so we don't need to use babel-plugin-react-intl
const obj = {};
[simpleMessages, resourcesMessages, postMessages, commentMessages, userMessages].forEach((msgs) => {
  Object.values(msgs).forEach((value) => {
    obj[value.id] = value.defaultMessage;
  });
});

export const messages = {
  ...englishMessages,
  ...obj,
};

export default messages;