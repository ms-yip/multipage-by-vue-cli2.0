/*
 * @Description:
 * @Autor: ms.y
 * @Date: 2020-04-11 16:08:52
 * @LastEditors: ms.y
 * @LastEditTime: 2020-04-11 19:06:11
 */
const Mock = require('mockjs')
// console.log(Mock)
Mock.mock('/qwerty.php/api', {
  'code': '0001',
  'msg': '成功',
  '_t': '1586180601',
  'data': {
    'total': 1,
    'data': [{
      'id': '438',
      'owner_license': '445102199511142322',
      'renter_id': '0',
      'housecusid': 'GZ12-SDLQ-01-00-88-88-8888',
      'rent_begin': '1585644191',
      'rent_end': '1601109795',
      'remark': null,
      'renter_': ''
    }]
  }
})
