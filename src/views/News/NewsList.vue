<template>
  <div class="news">
    <div class="newsList" v-if="newsList.length">
      <ul>
        <li @click="selectItem(item)" v-for="item in newsList" class="item">
          <div class="icon">
            <img :src="item.imgurl" class="newImg">
          </div>
          <div class="listText">
            <h2 class="name" v-html="item.title"></h2>
            <p class="time" v-html="item.date"></p>
            <p class="content" v-html="item.content"></p>
          </div>
        </li>
      </ul>
      <v-pagination :total="total" :current-page='current' @pagechange="pagechange"></v-pagination>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
import {getNewsList} from '@/api/newsList'
import Pagination from '@/base/Pagination/pagination'
export default {
  data () {
    return {
      newsList: [],
      total: 30,
      display: 5,
      current: 1
    }
  },
  beforeCreate: function () {
    document.getElementsByTagName('body')[0].style.margin = 0
  },
  created () {
    this._getNewsList(1)
  },
  methods: {
    selectItem (item) {
      this.$router.push({
        path: `/newslist/${item.id}`
      })
    },
    pagechange: function (currentPage) {
      console.log(currentPage)
      // ajax请求, 向后台发送 currentPage, 来获取对应的数据
      this._getNewsList(currentPage, this.display)
    },
    _getNewsList (currentPage, display) {
      getNewsList(currentPage, display).then((res) => {
        this.newsList = res.data
      })
    }
  },
  components: {
    'v-pagination': Pagination
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/variable.styl"
@import "../../common/stylus/reset.styl"
.newsList
  margin:0 auto
  text-align left
  top: 60px;
  position: absolute;
  ul
    width:80%
    margin:0 auto
    margin-top:20px
    li
      display:flex
      box-sizing:border-box
      align-items:center
      padding:10px 10px
      margin-top:20px
      height:200px
      background-color: #F6F7FB
      border-radius: 4px
      font-family: PingFangSC-Regular
      cursor:pointer
      transition:all 0.2s linear
      &:hover
        background-color: #fff;
        box-shadow: 4px 9px 17px 2px rgba(201,224,255,0.46);
      .listText
        display:flex
        position:relative
        flex-direction:column
        justify-content:center
        flex:1
        overflow:hidden
        .name
          margin-bottom:10px
          color:#000
          font-weight 600
          font-size:$font-size-medium-x
          font-family: PingFangSC-Regular
        .time
          margin-bottom:8px
          color:#000
          font-size:$font-size-medium-x
          font-family: PingFangSC-Regular
        .content
          font-family: PingFangSC-Light
          font-size: $font-size-medium
          text-overflow: ellipsis
          display: -webkit-box
          -webkit-line-clamp: 3
          -webkit-box-orient: vertical
          color: #A2A6AD;
.newImg{
  height 140px
  width 230px
  padding 0px 15px
}
@media screen and (max-width: 1200px)
  .newsList
    margin:0 auto
    text-align left
    top: 60px;
    position: absolute;
@media screen and (max-width: 600px)
  .newImg{
    height 80px
    width 120px
    padding-right 10px
  }
  .newsList
    margin:0 auto
    text-align left
    top: 60px;
    position: absolute;
    ul
      width:80%
      margin:0 auto
      margin-top:20px
      li
        display:flex
        box-sizing:border-box
        align-items:center
        padding:10px 10px
        margin-top:20px
        height:160px
        background-color: #F6F7FB
        border-radius: 4px
        font-family: PingFangSC-Regular
        cursor:pointer
        transition:all 0.2s linear
        &:hover
          background-color: #fff;
          box-shadow: 4px 9px 17px 2px rgba(201,224,255,0.46);
        .listText
          display:flex
          position:relative
          flex-direction:column
          justify-content:center
          flex:1
          overflow:hidden
          .name
            margin-bottom:10px
            color:#000
            font-weight 600
            font-size:$font-size-small
            font-family: PingFangSC-Regular
          .time
            margin-bottom:8px
            color:#000
            font-size:$font-size-small
            font-family: PingFangSC-Regular
          .content
            font-family: PingFangSC-Light
            font-size: $font-size-small
            text-overflow: ellipsis
            display: -webkit-box
            -webkit-line-clamp: 3
            -webkit-box-orient: vertical
            color: #A2A6AD;
@media screen and (max-width: 480px)
  .newImg{
    height 80px
    width 120px
    padding-right 15px
  }
</style>
