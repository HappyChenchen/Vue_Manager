// 引入mockjs
const Mock = require('mockjs')
// 获取 mock.Random 对象
const Random = Mock.Random
// 随机生成文章数据
const produceMonthData = req => {
  console.log(req) // 请求体，用于获取参数gangcai yao
  let regions = ['滨海', '东丽', '津南', '西青', '宁河']
  let posts = [] // 用于存放数据的数组
  for (let i = 0; i < 5; i++) {
    let j1 = Random.float(60, 100, 2, 3)
    let q1 = Random.float(40, 60, 2, 3)
    let j2 = Random.float(60, 100, 2, 3)
    let q2 = Random.float(40, 60, 2, 3)
    let j3 = Random.float(60, 100, 2, 3)
    let q3 = Random.float(40, 60, 2, 3)
    let j4 = Random.float(60, 100, 2, 3)
    let q4 = Random.float(40, 60, 2, 3)
    let j5 = Random.float(60, 100, 2, 3)
    let q5 = Random.float(40, 60, 2, 3)
    let j6 = Random.float(60, 100, 2, 3)
    let q6 = Random.float(40, 60, 2, 3)
    let j7 = Random.float(60, 100, 2, 3)
    let q7 = Random.float(40, 60, 2, 3)
    let j8 = Random.float(60, 100, 2, 3)
    let q8 = Random.float(40, 60, 2, 3)
    let j9 = Random.float(60, 100, 2, 3)
    let q9 = Random.float(40, 60, 2, 3)
    let j10 = Random.float(60, 100, 2, 3)
    let q10 = Random.float(40, 60, 2, 3)
    let post = {
      'region': regions[i],
      'JHS1': j1 + '平方米',
      'QDS1': q1 + '平方米',
      'ZB1': ((q1 / j1) * 100).toFixed(2),
      'JHS2': j2 + '平方米',
      'QDS2': q2 + '平方米',
      'ZB2': ((q2 / j2) * 100).toFixed(2),
      'JHS3': j3 + '平方米',
      'QDS3': q3 + '平方米',
      'ZB3': ((q3 / j3) * 100).toFixed(2),
      'JHS4': j4 + '平方米',
      'QDS4': q4 + '平方米',
      'ZB4': ((q4 / j4) * 100).toFixed(2),
      'JHS5': j5 + '平方米',
      'QDS5': q5 + '平方米',
      'ZB5': ((q5 / j5) * 100).toFixed(2),
      'JHS6': j6 + '平方米',
      'QDS6': q6 + '平方米',
      'ZB6': ((q6 / j6) * 100).toFixed(2),
      'JHS7': j7 + '平方米',
      'QDS7': q7 + '平方米',
      'ZB7': ((q7 / j7) * 100).toFixed(2),
      'JHS8': j8 + '平方米',
      'QDS8': q8 + '平方米',
      'ZB8': ((q8 / j8) * 100).toFixed(2),
      'JHS9': j9 + '平方米',
      'QDS9': q9 + '平方米',
      'ZB9': ((q9 / j9) * 100).toFixed(2),
      'JHS10': j10 + '平方米',
      'QDS10': q10 + '平方米',
      'ZB10': ((q10 / j10) * 100).toFixed(2),
    }
    posts.push(post)
  }
  // 返回posts
  return {
    data: posts
  }
}

const produceNewsData = function () {
  let articles = []
  for (let i = 0; i < 5; i++) {
    let newArticleObject = {
      id: i + 1,
      title: '新闻标题'+(i+1), //  Random.csentence( min, max )
      imgurl: Random.dataImage('300x250', '新闻图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
      content: Random.csentence(40,80), // Random.cname() 随机生成一个常见的中文姓名
      date: '2019-04-11' // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
    }
    articles.push(newArticleObject)
  }
  return {
    data: articles
  }
}

const produceArcticleData = function () {
  let data = {
    id: 1,
    author: '张三',
    title: '新闻标题', //  Random.csentence( min, max )
    imgurl: Random.dataImage('300x250', '新闻图片'), // Random.dataImage( size, text ) 生成一段随机的 Base64 图片编码
    content: Random.cparagraph(100, 150), // Random.cname() 随机生成一个常见的中文姓名
    date: '2019-04-11' // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
  }

  return data
}

// 定义请求链接，类型，还有返回数据
Mock.mock(`/getmonthdata`, 'get', produceMonthData);
Mock.mock('/api', 'get', produceNewsData)
Mock.mock('/api/1', 'get', produceArcticleData)
Mock.mock('/api/2', 'get', produceArcticleData)
Mock.mock('/api/3', 'get', produceArcticleData)
Mock.mock('/api/4', 'get', produceArcticleData)
Mock.mock('/api/5', 'get', produceArcticleData)
