'use strict';
const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: './lib/lookup.js',
  mode: 'production',
  output: {
    filename: 'eth-reveal-[contenthash].js',
    path: path.resolve(__dirname),
    library: 'reveal',
    libraryTarget: 'umd',
    umdNamedDefine: true,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  mode: "none"
};
