import httpServer from './index';

const baseApi = process.env.NODE_ENV == 'production' ? '' : 'api';

// 用户

//用户注册
export function register(param) {
  return httpServer.post(baseApi + '/user/register', param);
}

//用户登录
export function login(param) {
  return httpServer.post(baseApi + '/user/login', param, {
    // headers: {
    //   'Content-Type': 'application/x-www-form-urlencoded',
    // },
  });
}

//船舶列表
export function getVessel(param) {
  return httpServer.get(baseApi + '/vessel', param);
}

//创建船舶
export function postVessel(param) {
  return httpServer.post(baseApi + '/vessel', param);
}

//船舶详情
export function getVesselInfo(param) {
  return httpServer.get(baseApi + `/vessel/${param.vessel_id}`, param);
}

//更新船舶详情
export function putVesselInfo(param) {
  return httpServer.put(baseApi + `/vessel/${param.vessel_id}`, param);
}

//删除船舶详情
export function delVesselInfo(param) {
  return httpServer.del(baseApi + `/vessel/${param.vessel_id}`, param);
}

//设备燃料类型
export function getFueType(param) {
  return httpServer.get(baseApi + '/meta/fuel_type', param);
}
//船舶类型
export function getShipType(param) {
  return httpServer.get(baseApi + '/meta/ship_type', param);
}

//属性类型
export function getAttributes(param) {
  return httpServer.get(baseApi + '/meta/attributes', param);
}
//属性组合类型
export function getAttributeMapping(param) {
  return httpServer.get(baseApi + '/meta/attribute_mapping', param);
}

//燃料类型分类
export function getFuelTypeCategory(param) {
  return httpServer.get(baseApi + '/meta/fuel_type_category', param);
}

//用船时区
export function getTimeZone(param) {
  return httpServer.get(baseApi + '/meta/time_zone', param);
}

//获取公司
export function getCompany(param) {
  return httpServer.get(baseApi + '/company', param);
}

//创建公司
export function setCompany(param) {
  return httpServer.post(baseApi + '/company', param);
}

//公司详情
export function getCompanyInfo(param) {
  return httpServer.get(baseApi + `/company/${param.company_id}`, param);
}

//修改公司
export function putCompanyInfo(param) {
  return httpServer.put(baseApi + `/company/${param.company_id}`, param);
}

//删除公司
export function delCompanyInfo(param) {
  return httpServer.del(baseApi + `/company/${param.company_id}`, param);
}

//获取公司船只
export function getCompanyShip(param) {
  return httpServer.get(baseApi + `/vessel`, param);
}

//上传数据
export function uploadData(param) {
  return httpServer.post(baseApi + `/upload/vessel/${param.vessel_id}/original`, param, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

//获取上传历史
export function getUploadHistory(param) {
  return httpServer.get(baseApi + `/upload/vessel/${param.id}/history`, param);
}

//"数据分析与回放"页面直方图api，返回值为列表，列表的每个值的形式为（所选属性的值，属性值对应的频次），对应于直方图：x轴为属性值，y轴为频次
export function attributeFrequencies(param) {
  return httpServer.get(baseApi + `/statistic/attribute-frequencies`, param);
}
//散点图
export function attributeValues(param) {
  return httpServer.get(baseApi + `/statistic/attribute-values`, param);
}

//"能效多角度展示"页面散点图api
export function attributeRelation(param) {
  return httpServer.get(baseApi + `/statistic/attribute-relation`, param);
}

//首页-多船，显示单个船舶的平均数据
export function vesselAverage(param) {
  return httpServer.get(baseApi + `/statistic/vessel/${param.id}/average`, param);
}

//首页-多船，显示单个船舶的CII数据
export function vesselCii(param) {
  return httpServer.get(baseApi + `/statistic/vessel/${param.id}/cii`, param);
}

//首页，点击“查看上传历史”，显示单个船舶的数据完整度
export function vesselCompleteness(param) {
  return httpServer.get(baseApi + `/statistic/vessel/${param.id}/completeness`, param);
}

//每海里油耗能耗统计
export function consumptionNmile(param) {
  return httpServer.get(baseApi + `/statistic/consumption/nmile`, param);
}

//总油耗能耗统计
export function consumptionTotal(param) {
  return httpServer.get(baseApi + `/statistic/consumption/total`, param);
}

//"优化建议"页面走势
export function optimizationValues(param) {
  return httpServer.get(baseApi + `/optimazation/optimize-speed/${param.vessel_id}`, param);
}

//"优化建议"页面走势api，返回值为列表
export function optimizationFigure(param) {
  return httpServer.get(
    baseApi + `/statistic/vessel/${param.vessel_id}/optimization-figure`,
    param,
  );
}

//"船体及螺旋桨状态提醒页面"页面5个值api，返回值为5个值（据出厂状态增长的功率，据上次喷漆增长的功率，螺旋桨抛光后天数，船体清洁后天数，坞修后天数）
export function reminderValues(param) {
  return httpServer.get(baseApi + `/reminder/${param.vessel_id}/values`, param, {
    hideLoading: true,
  });
}

//"船体及螺旋桨状态提醒页面"页面的图api，返回值为列表，列表的每个值的形式为（对水航速值，参考期功率值，当前功率值），对应于散点图：x轴为对水航速的值，y轴为两种功率的值

export function reminderFigure(param) {
  return httpServer.get(baseApi + `/reminder/${param.vessel_id}/graph`, param);
}

//首页-多船，显示单个船舶的CII数据
export function shipCii(param) {
  return httpServer.get(baseApi + `/statistic/vessel/${param.vessel_id}/cii`, param);
}
