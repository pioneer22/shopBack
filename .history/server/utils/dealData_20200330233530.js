const dealReturnData = (data) => {
  let type = data instanceof Array ? [] : {}
  console.log(type)
  let returnData = {
    "message": [],
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  if (data.length > 0) {
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