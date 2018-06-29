module.exports = {
    resolve: {
        extensions: ['.js'],
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
            },
        ],
    },
};
