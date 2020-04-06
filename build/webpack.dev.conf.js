'use strict'
const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')
// mock data
const express = require('express')
const app = express()
const apiRoutes = express.Router()


const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap, usePostCSS: true })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    index: "/page1.html", // 默认启动页面
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [
        { from: /.*/, to: path.posix.join(config.dev.assetsPublicPath, 'index.html') },
      ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay
      ? { warnings: false, errors: true }
      : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    },
    before (app) {
      app.get('/qwerty.php/LinliUserAuth/UserAuth/RenterList?', (req, res) => {
        res.json(
          {
            "code": "0001",
            "msg": "成功",
            "_t": "1586180601",
            "data": {
              "total": 1,
              "data": [{
                "id": "438",
                "owner_license": "445102199511142322",
                "renter_id": "0",
                "housecusid": "GZ12-SDLQ-01-00-88-88-8888",
                "rent_begin": "1585644191",
                "rent_end": "1601109795",
                "remark": null,
                "renter_name": "阿里健康",
                "renter_mobile": "88855555555",
                "renter_id_card": "440512555555555555",
                "owner_name": "蔡点",
                "owner_mobile": "18826101140",
                "type": "1",
                "status": "1",
                "operation_id": "4003",
                "add_time": "2020-03-31 16:43:26",
                "update_time": "0",
                "rent_data": "2020-03-31 16:43:11--2020-09-26 16:43:15",
                "owner_estate": "---",
                "renter_license": "440512555555555555"
              }]
            }
          }
        )
      }),
      app.get('/qwerty.php/LinliUserAuth/UserAuth/OwnerList?', (req, res) => {
        res.json(
          {
            "code": "0001",
            "msg": "成功",
            "_t": "1586180980",
            "data": {
              "total": 1,
              "data": [{
                "id": "59",
                "owner_name": "同证多号",
                "room": "三水物业_时代城（三期）1151至1200号001151",
                "mobile": "19900000011",
                "id_card_type": "身份证",
                "id_card": "110101199003074717",
                "auth_type": "---",
                "submit_time": "---",
                "add_time": "2020-03-26 18:37:12",
                "auth_status_name": "---",
                "remark": "---",
                "status": "1"
              }]
            }
          }
        )
      }),
      app.get('/qwerty.php/LinliUserAuth/UserAuth/FamilyList?', (req, res) => {
        res.json(
          {
            "code": "0001",
            "msg": "成功",
            "_t": "1586180980",
            "data": {
              "total": 1,
              "data": [{
                "id": "1001",
                "user_id": "3498",
                "owner_license": "45032619908101111",
                "housecusid": "FS01-MXX2-01-0-05--4908",
                "family_id": "0",
                "remark": "我的家人",
                "family_name": "周杰伦",
                "family_mobile": "16620321111",
                "owner_id": "3498",
                "owner_name": "天通苑",
                "owner_mobile": "18323221111",
                "type": "1",
                "status": "2",
                "add_time": "2020-04-03 18:09:42",
                "update_time": "0",
                "owner_estate": "---"
              }]
            }
          }
        )
      }),
      app.get('/qwerty.php/LinliAPPHomePage/GoodManage/getData?', (req, res) => {
          res.json(
            {
              "code": "0001",
              "msg": "成功",
              "_t": "1586180980",
              "data": {
                "total": 1,
                "data": [{
                  "id": "474",
                  "type": "9",
                  "position": "0",
                  "jump_type": "1",
                  "img": "https://www.baidu.com/img/baidu_resultlogo@2.png",
                  "estate_id_list": "1152,2010,2043,2046",
                  "content": "34234",
                  "addtime": "1582862428",
                  "last_update_time": "0",
                  "starttime": "2020-02-28 00:00:00",
                  "endtime": "2030-02-28 00:00:00",
                  "jump_id": "32",
                  "params": "{'ios ':null,'and ':null}",
                  "weight": "7",
                  "click_pv_count": "0",
                  "click_uv_count": "0",
                  "status": "1",
                  "is_delete": "0",
                  "function_type": "0",
                  "start_version": "0",
                  "end_version": "99.99",
                  "addition_type": "0",
                  "price": "34.00",
                  "remark": "",
                  "status_name": "待发布",
                  "type_name": "单品",
                  "add_time": "2020-02-28 12:00:28",
                  "estate_name": "世纪花园,开源大道项目"
                }]
              }
          }
        )
      }),
      app.get('LinliStar/Star/getStarList', (req, res) => {
        res.json(
          {
            "code": "0001",
            "msg": "成功",
            "_t": "1586180980",
            "data": {
              "total": 1,
              "data": [{
                "id": "51",
                "name": "cr",
                "station": "cr",
                "pic": "30696",
                "pic_face": "30697",
                "sorting": "45",
                "pk_corp": "",
                "estate": "ceshi",
                "estate_id": "1966",
                "detail": "<p>1123</p>",
                "detail_new": "<p>123123</p>",
                "is_delete": "1",
                "status": "1",
                "create_time": "2020-02-28 09:47:23",
                "pic_url": "https://www.baidu.com/img/baidu_resultlogo@2.png",
                "pic_face_url": "https://www.baidu.com/img/baidu_resultlogo@2.png"
              }]
            }
          }
        )
      })
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    // new HtmlWebpackPlugin({
    //   filename: 'index.html',
    //   template: 'index.html',
    //   inject: true
    // }),
    // copy custom static assets
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../static'),
        to: config.dev.assetsSubDirectory,
        ignore: ['.*']
      }
    ])
  ]
  .concat(utils.htmlPlugin())
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors
        ? utils.createNotifierCallback()
        : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
