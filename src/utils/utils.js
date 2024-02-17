const awaitWrap = (promise) => {
  return promise.then((data) => [null, data]).catch((err) => [err, null]);
};
export { awaitWrap };

const padZero = (number) => {
  return number.toString().padStart(2, '0');
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const formattedDateTime = `${date.getFullYear()}-${padZero(date.getMonth() + 1)}-${padZero(
    date.getDate(),
  )} ${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`;

  return formattedDateTime;
};
export { formatTimestamp };

const getTableData = (pageInfo, sourceData) => {
  //计算当前页第一条数据的下标，
  var i = (pageInfo.page - 1) * pageInfo.limit;
  //建立一个临时数组
  var arry = [];

  while (i < pageInfo.page * pageInfo.limit) {
    //解决最后一页出现null值
    if (sourceData[i] != null) {
      arry.push(sourceData[i]);
      i++;
      continue;
    }
    break;
  }
  return arry;
};
export { getTableData };
