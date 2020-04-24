const dealReturnData = (data) => {
  let type = data instanceof Array ? [] : {}
  let returnData = {
    "message": type,
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  console.log(type)
  console.log(type === '{}')
  if ((type === [] && data.length > 0) || (type === {} && Object.keys(data).length > 0)) {
    console.log(666)
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
