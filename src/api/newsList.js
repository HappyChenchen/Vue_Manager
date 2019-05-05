import axios from 'axios'
// 获取文章列表
export function getNewsList (currentPage, display) {
  return axios.get('/api')//, {params:{currentPage:currentPage,display:display}}
    .then(res => {
      return Promise.resolve(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}
// 获取文章详情
export function getNewsDetail (id) {
  // 通过axios来和后端进行交互
  // 通过给定的ID来发送请求
  return axios.get(`/api/${id}`)
    .then(res => {
      console.log(res)
      return Promise.resolve(res.data)
    })
    .catch(err => {
      console.log(err)
    })
}
