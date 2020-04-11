'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      // "/qwerty.php": {
      //   target: 'http://localhost:8099',
      //   changeOrigin: true,
      //   secure: false
      // },
    },

    // Various Dev Server settings
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8099, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    autoOpenBrowser: false,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    indexPath: { // 文件夹名： 打包到的位置
      'starStaff': path.resolve(__dirname, '../../../6.0.0/adm/adm/LinliStar/View/Star/'),
      // 'family': path.resolve(__dirname, '../../../6.0.1/adm/adm/LinliUserAuth/View/Family/'),
      // 'Goods': path.resolve(__dirname, '../../../6.0.1/adm/adm/LinliAPPHomePage/View/GoodManage/'),
      // 'houses': path.resolve(__dirname, '../../../6.0.1/adm/adm/LinliUserAuth/View/Houses/'),
      // 'tenants': path.resolve(__dirname, '../../../6.0.1/adm/adm/LinliUserAuth/View/Tenants/'),
    },
    assetsRoot: path.resolve(__dirname, '../../../6.0.0'),
    assetsSubDirectory: 'Public/adm/js/vueMultiPages',
    assetsPublicPath: '/',

    /**
     * Source Maps
     */

    productionSourceMap: true,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    bundleAnalyzerReport: process.env.npm_config_report
  }
}
