import axios from 'axios'
// 获取某一文章内容
export function getArticleContent (id) {
  // 通过axios来和后端进行交互
  // 通过给定的ID来发送请求
  return axios.get(`/api/${id}`)
    .then(
      res => {
        return Promise.resolve(res.data)
      }
    )
    .catch(err => {
      console.log(err)
    })
}

// 编辑文章
export function editArticleContent (id, title, content) {
  // 通过axios来和后端进行交互
  // 通过给定的ID来发送请求
  return axios.put(`/api/${id}`, {title: title, content: content, state: 'publish'})
    .then(
      res => {
        return Promise.resolve(res.data)
      }
    )
    .catch(err => {
      console.log(err)
    })
}

export function saveArticleContent (obj) {
  // 通过axios来和后端进行交互
  // 通过给定的ID来发送请求
  return axios.post('/api', {
    postInformation: obj
  })
    .then(
      res => {
        return Promise.resolve(res.data)
      }
    )
    .catch(err => {
      console.log(err)
    })
}

// 获取所有的文章
export function getAllArticleContent () {
  // 通过axios来和后端进行交互
  // 通过给定的ID来发送请求
  return axios.get('/api')
    .then(
      res => {
        return Promise.resolve(res.data)
      }
    )
    .catch(err => {
      console.log(err)
    })
}

// 删除文章
export function deleteArticle (id) {
  // 通过axios来和后端进行交互
  // 通过给定的ID来发送请求
  return axios.delete(`/api/${id}`)
    .then(
      res => {
        return Promise.resolve(res.data)
      }
    )
    .catch(err => {
      console.log(err)
    })
}
