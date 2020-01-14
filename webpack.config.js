const path = require('path');
const _ = require('lodash');
const MinifyPlugin = require('babel-minify-webpack-plugin');

const conf = {
  entry: {
    webpack_hd: './src/js/webpack.vendor_hd.js',
    webpack_bd: './src/js/webpack.vendor_bd.js',
    main_hd: './src/js/webpack.main_hd.js',
    main_bd: './src/js/webpack.main_bd.js',
  },
  output: {
    filename: '[name].js',
  },
  module: {
    rules: [
    ]
  },
};

module.exports = {
  dev: _.assign(_.cloneDeep(conf), {
    mode: 'development',
    resolve: {
      extensions: ['.js'],
      alias: {
        'lodash': path.resolve(__dirname, 'node_modules/lodash/lodash.js'),
        'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.js'),
        'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.js'),
        'vue-router': path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.js'),
        'vuex': path.resolve(__dirname, 'node_modules/vuex/dist/vuex.js'),
        'popper.js': path.resolve(__dirname, 'node_modules/popper.js/dist/umd/popper.js'),
        'bootstrap': path.resolve(__dirname, 'node_modules/bootstrap/dist/js/bootstrap.js'),
      },
    },
  }),
  prod: _.assign(_.cloneDeep(conf), {
    mode: 'production',
    resolve: {
      extensions: ['.js'],
      alias: {
        'lodash': path.resolve(__dirname, 'node_modules/lodash/lodash.min.js'),
        'jquery': path.resolve(__dirname, 'node_modules/jquery/dist/jquery.min.js'),
        'vue': path.resolve(__dirname, 'node_modules/vue/dist/vue.min.js'),
        'vue-router': path.resolve(__dirname, 'node_modules/vue-router/dist/vue-router.min.js'),
        'vuex': path.resolve(__dirname, 'node_modules/vuex/dist/vuex.min.js'),
        'popper.js': path.resolve(__dirname, 'node_modules/popper.js/dist/umd/popper.min.js'),
        'bootstrap': path.resolve(__dirname, 'node_modules/bootstrap/dist/js/bootstrap.min.js'),
      },
    },
    plugins: [
      new MinifyPlugin({}, {
        comments: false,
      })
    ]
  }),
};
