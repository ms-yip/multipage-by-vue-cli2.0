'use strict'
const path = require('path')
const config = require('../config')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const packageConfig = require('../package.json')
const glob = require('glob') // @TODO多页面2
const HtmlWebpackPlugin = require('html-webpack-plugin') // @TODO多页面2
const merge = require('webpack-merge') // @TODO多页面2
const PAGE_PATH = path.resolve(__dirname, '../src/pages/**/*.') // @TODO多页面2
//多入口配置
// 通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件，如果该文件存在
// 那么就作为入口处理
exports.entries = function () {
  var entryFiles = glob.sync(PAGE_PATH + 'js')
  var map = {}
  entryFiles.forEach((filePath) => {
    let tmp = ''
    tmp = filePath.split("/").splice(-3)
    // var filename = filePath.substring(filePath.lastIndexOf('\/') + 1, filePath.lastIndexOf('.')) // 用于js文件名不同时
    map[tmp[1]] = filePath
  })
  return map
}

// 多页面输出配置
// 与上面的多页面入口配置相同，读取pages文件夹下的对应的html后缀文件，然后放入数组中
exports.htmlPlugin = function () {
  // 获取目录下所有html文件（可能没有）
  let htmls = {}
  let arr = []
  let entries = this.entries()
  let entryHtml = glob.sync(PAGE_PATH + 'html')
  if (entryHtml && entryHtml.length) {
    entryHtml.forEach((filePath) => {
      let tmp = ''
      tmp = filePath.split("/").splice(-3)
      htmls[tmp[1]] = filePath
    })
  }
  // console.log(htmls);
  Object.keys(entries).forEach(item => {
    let filename = ''
    if (process.env.NODE_ENV === 'production') {
      filename = (config.build.indexPath[item] ? config.build.indexPath[item] + '/' : '') + item + '.html' // 打包
    }
    let conf = {
      // // 模板来源
      template: htmls[item] || path.resolve(__dirname, '../index.html'),
      // // 文件名称
      filename: filename || item + '.html',
      // // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', item],
      inject: true
    }
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true
        },
        chunksSortMode: 'dependency'
      })
    }
    arr.push(new HtmlWebpackPlugin(conf))
  })
  arr.push(new HtmlWebpackPlugin({
    // 加入一个菜单页
    template: path.resolve(__dirname, '../index.html'),
    filename: 'index.html',
    chunks: ['manifest', 'vendor', 'index'],
    inject: true
  }))
  // console.log("htmlPlugin" + JSON.stringify(arr));
  return arr
}

exports.assetsPath = function (_path) {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ?
    config.build.assetsSubDirectory :
    config.dev.assetsSubDirectory

  return path.posix.join(assetsSubDirectory, _path)
}

exports.cssLoaders = function (options) {
  options = options || {}

  const cssLoader = {
    loader: 'css-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  }

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader]

    if (loader) {
      loaders.push({
        loader: loader + '-loader',
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap
        })
      })
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader'
      })
    } else {
      return ['vue-style-loader'].concat(loaders)
    }
  }

  // https://vue-loader.vuejs.org/en/configurations/extract-css.html
  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', {
      indentedSyntax: true
    }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  }
}

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = []
  const loaders = exports.cssLoaders(options)

  for (const extension in loaders) {
    const loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      use: loader
    })
  }

  return output
}

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier')

  return (severity, errors) => {
    if (severity !== 'error') return

    const error = errors[0]
    const filename = error.file && error.file.split('!').pop()

    notifier.notify({
      title: packageConfig.name,
      message: severity + ': ' + error.name,
      subtitle: filename || '',
      icon: path.join(__dirname, 'logo.png')
    })
  }
}
