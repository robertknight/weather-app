var webpack = require('webpack');
module.exports = {
    entry: './build/js/main.js',
    output: {
		path: './dist',
		filename: '[name]-bundle.js'
    }
};
