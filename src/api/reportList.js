import axios from 'axios'
// 获取月报表
export function getMonthReportList (year, month) {
  return axios.get('/getmonthdata')
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}
export function getWeekReportList (year, month, week) {
  return axios.get('/getmonthdata')
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}

