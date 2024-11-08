import englishMessages from 'ra-language-english';

export const messages = {
    simple: {
        action: {
            close: 'Close',
            resetViews: 'Reset views',
        },
        'create-post': 'New post',
    },
    ...englishMessages,
    resources: {
        posts: {
            name: 'Post |||| Posts',
            fields: {
                commentable_short: 'Com.',
                commentable: 'Commentable',
                notifications: 'Notifications recipients',
                nb_view: 'Nb views',
                nb_comments: 'Nb comments',
                password: 'Password (if protected post)',
                pictures: 'Related Pictures',
            },
            notifications: {
                created: 'Post created |||| %{smart_count} posts created',
                updated: 'Post updated |||| %{smart_count} posts updated',
                deleted: 'Post deleted |||| %{smart_count} posts deleted',
            },
        },
        comments: {
            name: 'Comment |||| Comments',
            fields: {
                post_id: 'Post',
            },
            notifications: {
                created: 'Comment created |||| %{smart_count} comments created',
                updated: 'Comment updated |||| %{smart_count} comments updated',
                deleted: 'Comment deleted |||| %{smart_count} comments deleted',
            },
        },
        users: {
            name: 'User |||| Users',
            fields: {
                name: 'Name',
                role: 'Role',
            },
            notifications: {
                created: 'User created |||| %{smart_count} users created',
                updated: 'User updated |||| %{smart_count} users updated',
                deleted: 'User deleted |||| %{smart_count} users deleted',
            },
        },
    },
    post: {
        list: {
            search: 'Search',
        },
        form: {
            summary: 'Summary',
            body: 'Body',
            miscellaneous: 'Miscellaneous',
            comments: 'Comments',
        },
        edit: {
            title: 'Post "%{title}"',
        },
        action: {
            save_and_edit: 'Save and Edit',
            save_and_add: 'Save and Add',
            save_and_show: 'Save and Show',
            save_with_average_note: 'Save with Note',
        },
    },
    comment: {
        list: {
            about: 'About',
        },
    },
    user: {
        list: {
            search: 'Search',
        },
        form: {
            summary: 'Summary',
            security: 'Security',
        },
        action: {
            save_and_add: 'Save and Add',
            save_and_show: 'Save and Show',
        },
    },
};

export default messages;
