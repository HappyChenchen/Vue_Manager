/**
 * Created with WY
 * Date: 2018/9/23
 * Time: 20:52
 *
 */
import axios from 'axios'
import qs from 'qs'
const BASE_URL = ''
export default {
  sendMessage (logMessage) {
    let BASE_URL = ''
    if (process.env.NODE_ENV === 'production') {
      BASE_URL = ''
    } else {
      BASE_URL = '/api'
    }
    axios.post(BASE_URL + '/log/insert', qs.stringify(logMessage))
      .then(function (response) {
        // console.log(response)
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  dateConvert (dateParms) {
    // 对传入的时间参数进行判断
    if (dateParms instanceof Date) {
      var datetime = dateParms
    }
    // 判断是否为字符串
    if ((typeof dateParms === 'string') && dateParms.constructor == String) {
      // 将字符串日期转换为日期格式
      var datetime = new Date(Date.parse(dateParms.replace(/-/g, '/')))
    }

    // 获取年月日时分秒
    var year = datetime.getFullYear()
    var month = datetime.getMonth() + 1
    var date = datetime.getDate()
    var hour = datetime.getHours()
    var minutes = datetime.getMinutes()
    var second = datetime.getSeconds()

    // 月，日，时，分，秒 小于10时，补0
    if (month < 10) {
      month = '0' + month
    }
    if (date < 10) {
      date = '0' + date
    }
    if (hour < 10) {
      hour = '0' + hour
    }
    if (minutes < 10) {
      minutes = '0' + minutes
    }
    if (second < 10) {
      second = '0' + second
    }

    // 拼接日期格式【例如：yyyymmdd】
    var time = year.toString() + month.toString() + date.toString()+ hour.toString()+minutes.toString()+second.toString();

    // 或者：其他格式等
    // var time = year+"年"+month+"月"+date+"日"+hour+":"+minutes+":"+second;

    // 返回处理结果
    return time
  },
  BASE_URL,
}
