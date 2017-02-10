export const messages = {
    resources: {
        posts: {
            name: 'Post |||| Posts',
            fields: {
                allow_comments: 'Allo comments?',
                average_note: 'Average note',
                body: 'Body',
                comments: 'Comments',
                commentable: 'Commentable',
                created_at: 'Created at',
                notifications: 'Notifications recipients',
                nb_view: 'Nb views',
                password: 'Password (if protected post)',
                pictures: 'Related Pictures',
                published_at: 'Published at',
                teaser: 'Teaser',
                title: 'Title',
                views: 'Vues',
            },
        },
        comments: {
            name: 'Comment |||| Comments',
            fields: {
                body: 'Body',
                created_at: 'Created at',
                posts: 'Posts',
                author: {
                    name: 'Author',
                },
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
    },
    comment: {
        list: {
            about: 'About',
        },
    },
};

export default messages;
