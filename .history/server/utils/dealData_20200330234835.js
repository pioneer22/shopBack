const dealReturnData = (data) => {
  let isArray = data instanceof Array
  let type = isArray ? [] : {}
  let returnData = {
    "message": type,
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  if ((isArray && data.length > 0) || (!isArray && Object.keys(data).length > 0)) {
    returnData.message = data
    returnData.meta = {
      "msg": "获取成功",
      "status": 200
    }
  }
  return returnData
}

module.exports = {
  dealReturnData
}
