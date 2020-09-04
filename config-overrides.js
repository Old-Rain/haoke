const { override, fixBabelImports } = require('customize-cra')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const myTerser = new TerserWebpackPlugin({
  terserOptions: {
    parse: {
      ecma: 8
    },
    compress: {
      ecma: 5,
      warnings: false,
      drop_debugger: true,
      drop_console: true,
      comparisons: false,
      inline: 2
    },
    mangle: {
      safari10: true
    },
    keep_classnames:
      process.env.NODE_ENV !== 'development' &&
      process.argv.includes('--profile'),
    keep_fnames:
      process.env.NODE_ENV !== 'development' &&
      process.argv.includes('--profile'),
    output: {
      ecma: 5,
      comments: false,
      ascii_only: true
    }
  },
  sourceMap: process.env.GENERATE_SOURCEMAP !== 'false'
})

module.exports = override(
  fixBabelImports('import', {
    libraryName: 'antd-mobile',
    style: 'css'
  }),
  config => {
    // console.log(config)
    config.optimization.minimizer = [...config.optimization.minimizer, myTerser]
    return config
  }
)
