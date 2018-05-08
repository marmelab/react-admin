const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.html$/,
        exclude: /node_modules/,
        use: { loader: 'html-loader' },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
    }),
  ],
  resolve: {
    alias: {
      '@yeutech/ra-core': path.join(
          __dirname,
          '..',
          '..',
          'packages',
          'ra-core',
          'src'
      ),
      '@yeutech/ra-ui-bootstrap-styled': path.join(
          __dirname,
          '..',
          '..',
          'packages',
          'ra-ui-bootstrap-styled',
          'src'
      ),
      '@yeutech/react-admin-bs': path.join(
          __dirname,
          '..',
          '..',
          'packages',
          'react-admin-bs',
          'src'
      ),
      '@yeutech/ra-data-fakerest': path.join(
          __dirname,
          '..',
          '..',
          'packages',
          'ra-data-fakerest',
          'src'
      ),
      '@yeutech/ra-input-rich-text': path.join(
          __dirname,
          '..',
          '..',
          'packages',
          'ra-input-rich-text',
          'src'
      ),
    },
  },
  devServer: {
    stats: {
      children: false,
      chunks: false,
      modules: false,
    },
  },
};
