const dealReturnData = (data) => {
  // let isArray = data instanceof Array
  let isArray = Array.isArray(data)
  let type = isArray ? [] : {}
  let returnData = {
    "data": type,
    "meta": {
      "msg": "获取失败",
      "status": 0
    }
  }
  if ((isArray && data.length > 0) || (!isArray && Object.keys(data).length > 0)) {
    returnData.data = data
    returnData.meta = {
      "msg": "获取成功",
      "status": 200
    }
  }
  return returnData
}

const addZero = (num) => {
  return num < 10 ? "0" + num : num
}

const getTime = (date) => {
  let returnTime = date.getFullYear() + "-" + addZero(date.getMonth() + 1) + "-" + addZero(date.getDate()) + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds())
  return returnTime
}

const quickSort = (array) => {
  if (array.length < 2) {
    return array
  }
  let pivot = array[array.length - 1]
  let left = array.filter((v, i) => v <= pivot && i != array.length - 1)
  let right = array.filter(v => v > pivot)
  return [...quickSort(left), pivot, ...quickSort(right)]
}

module.exports = {
  dealReturnData,
  getTime,
  quickSort
}
