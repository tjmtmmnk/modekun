const { merge } = require('webpack-merge');
const common = require('./webpack.firefox.common.js');

module.exports = merge(common, {
    devtool: 'inline-source-map',
    mode: 'development'
});