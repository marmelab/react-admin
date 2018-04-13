import { defineMessages } from 'react-intl';
import frenchMessages from '@yeutech/ra-language-intl/translation/fr.json';

const simpleMessages = defineMessages({
  actionResetViews: {
    id: 'simple.action.resetViews',
    defaultMessage: 'Réinitialiser des vues',
  }
});

const resourcesMessages = defineMessages({
  postsName: {
    id: 'resources.posts.name',
    defaultMessage: '{smart_count, plural, one {Article} other {Articles}}'
  },
  postsFieldsAverageNote: {
    id: 'resources.posts.fields.average_note',
    defaultMessage: 'Note moyenne'
  },
  postsFieldsBody: {
    id: 'resources.posts.fields.body',
    defaultMessage: 'Contenu'
  },
  postsFieldsComments: {
    id: 'resources.posts.fields.comments',
    defaultMessage: 'Commentaires'
  },
  postsFieldsCommentable: {
    id: 'resources.posts.fields.commentable',
    defaultMessage: 'Commentable'
  },
  postsFieldsCreatedAt: {
    id: 'resources.posts.fields.created_at',
    defaultMessage: 'Créé le'
  },
  postsFieldsNotifications: {
    id: 'resources.posts.fields.notifications',
    defaultMessage: 'Destinataires de notifications'
  },
  postsFieldsNbView: {
    id: 'resources.posts.fields.nb_view',
    defaultMessage: 'Nb de vues'
  },
  postsFieldsPassword: {
    id: 'resources.posts.fields.password',
    defaultMessage: 'Mot de passe (si protégé)'
  },
  postsFieldsPictures: {
    id: 'resources.posts.fields.pictures',
    defaultMessage: 'Photos associées'
  },
  postsFieldsPublishedAt: {
    id: 'resources.posts.fields.published_at',
    defaultMessage: 'Publié le'
  },
  postsFieldsTeaser: {
    id: 'resources.posts.fields.teaser',
    defaultMessage: 'Description'
  },
  postsFieldsTags: {
    id: 'resources.posts.fields.tags',
    defaultMessage: 'Catégories'
  },
  postsFieldsTitle: {
    id: 'resources.posts.fields.title',
    defaultMessage: 'Titre'
  },
  postsFieldsViews: {
    id: 'resources.posts.fields.views',
    defaultMessage: 'Vues'
  },
  commentsName: {
    id: 'resources.comments.name',
    defaultMessage: '{smart_count, plural, one {Commentaire} other {Commentaires}}'
  },
  commentsFieldsBody: {
    id: 'resources.comments.fields.body',
    defaultMessage: 'Contenu'
  },
  commentsFieldsCreatedAt: {
    id: 'resources.comments.fields.created_at',
    defaultMessage: 'Créé le'
  },
  commentsFieldsPostId: {
    id: 'resources.comments.fields.post_id',
    defaultMessage: 'Article'
  },
  commentsFieldsAuthorName: {
    id: 'resources.comments.fields.author.name',
    defaultMessage: 'Auteur'
  },
  usersName: {
    id: 'resources.users.name',
    defaultMessage: '{smart_count, plural, one {User} other {Users}}'
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
    defaultMessage: 'Recherche'
  },
  formSummary: {
    id: 'post.form.summary',
    defaultMessage: 'Résumé'
  },
  formBody: {
    id: 'post.form.body',
    defaultMessage: 'Contenu'
  },
  formMiscellaneous: {
    id: 'post.form.miscellaneous',
    defaultMessage: 'Extra'
  },
  formComments: {
    id: 'post.form.comments',
    defaultMessage: 'Commentaires'
  },
  editTitle: {
    id: 'post.edit.title',
    defaultMessage: 'Article \'{title}\''
  }
});
const commentMessages = defineMessages({
  listAbout: {
    id: 'comment.list.about',
    defaultMessage: 'Au sujet de'
  }
});
const userMessages = defineMessages({
  listSearch: {
    id: 'user.list.search',
    defaultMessage: 'Recherche'
  },
  formSummary: {
    id: 'user.form.summary',
    defaultMessage: 'Résumé'
  },
  formSecurity: {
    id: 'user.form.security',
    defaultMessage: 'Sécurité'
  },
  editTitle: {
    id: 'user.edit.title',
    defaultMessage: 'Utilisateur \'{title}\''
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
  ...frenchMessages,
  ...obj,
};

export default messages;