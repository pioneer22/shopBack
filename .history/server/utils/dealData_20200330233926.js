const dealReturnData = (data) => {
  let type = data instanceof Array ? [] : {}
  console.log(data)
  let returnData = {
    "message": type,
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  if ((type === [] && data.length > 0) || (type === {} && Object.keys(data).length > 0)) {
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
