import {
  getApi
} from './aixos'

// grid列表Api
export const getGridListApi = (params, url, config) =>
  getApi('get', url, params, config)
export const postGridListApi = (params, url, config) =>
  getApi('post', url, params, config)

export const login = params =>
  getApi('post', '/logz.html', params, {
    all: true,
    isFormData: true,
    needNull: true
  })

/**
 * linliAdm
 */

// 获取证件类型
export const getIdType = params =>
  getApi('get', '/LinliUserAuth/UserAuth/getIdType', params, {})
// 解绑
export const untiedUser = params =>
  getApi('get', '/LinliUserAuth/UserAuth/delete', params, {
    all: true
  })

// ======================明星员工=======================================

// 明星员工上下架
export const changeStaffStatus = params =>
  getApi('get', '/LinliStar/Star/change', params, {
    all: true
  })
// 添加编辑员工信息
export const updateStaff = params =>
  getApi('post', '/LinliStar/Star/addStar', params, {
    all: true,
    isFormData: true

  })
// 小区列表
export const getEstateList = params =>
  getApi('get', '/LinliStar/Star/corp', params, {
    all: true
  })
// 查找一个明星
export const getOneStar = params =>
  getApi('get', '/LinliStar/Star/getOneStar', params, {
    all: true
  })
// ==========================商品 ============================
// 添加商品
export const addGood = params =>
  getApi('post', '/LinliAPPHomePage/GoodManage/addGood', params, {
    all: true,
    isFormData: true
  })
// 添加商品
export const edtGood = params =>
  getApi('post', '/LinliAPPHomePage/GoodManage/editGood', params, {
    all: true,
    isFormData: true
  })
// 添加商品
export const getGoodDetail = params =>
  getApi('get', '/LinliAPPHomePage/GoodManage/editGoodTemp', params, {
    all: true
  })

export const changeGoodStatus = params =>
  getApi('get', '/LinliAPPHomePage/GoodManage/setStatus', params, {
    all: true
  })

export const dltGood = params =>
  getApi('get', '/LinliAPPHomePage/GoodManage/del', params, {
    all: true
  })

// ===================================
export const getJumpInfo = params =>
  getApi('get', '/Index/Common/getJumpInfo', params, {
    all: true
  })
export const getEstate = params =>
  getApi('get', '/Index/Common/getEstate', params, {
    all: true
  })
export default {}
