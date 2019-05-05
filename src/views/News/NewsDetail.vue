<template>
  <div>
    <div class="newsmain">
      <div class="article">
        <p class="newstitle" v-html="article.title"></p>
        <div class="submes">
          <span class="name">作者：</span><span class="author" v-html="article.author"></span>
          <span class="name date">发布时间：</span><span v-html="article.date"></span>
        </div>
        <div class="content" v-html="article.content"></div>
      </div>
    </div>
  </div>
</template>
<script>
import {getNewsDetail} from '@/api/newsList'
export default {
  beforeCreate: function () {
    document.getElementsByTagName('body')[0].style.margin = 0
  },
  created () {
    console.log('in')
    this._getNewsDetail()
  },
  data () {
    return {
      article: {}
    }
  },
  computed: {

  },
  methods: {
    _getNewsDetail () {
      let id = this.$route.params.id
      getNewsDetail(id).then(res => {
        console.log(res)
        this.article = res
      })
    }
  },
  components: {
  }
}
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
.newsmain
  width:90%
  margin:0 auto
  text-align: left;
  position absolute
  top 60px
  left: 0;
  right: 0;
  .page
    font-family: PingFangSC-Regular
    font-size: $font-size-medium-x
    color: #000
    margin-top:20px
    margin-left:20px
    span
      color:#a8a8a8
  .article
    width:90%
    margin 10px auto 0px auto
    background: #F6F7FB
    border-radius: 4px
    padding:20px
    .newstitle
      font-family: PingFangSC-Regular;
      font-size: 1.2rem;
      color: #000;
    .submes
      margin-top:10px;
      font-size: 1rem;
      color: #001200;
      line-height:25px;
      .name
        font-family: PingFangSC-Regular;
        font-size: 1rem;
        color: #A2A6AD;
      .date
        margin-left:30px
    .content
      margin-top:20px
      font-family: PingFangSC-Light;
      font-size: 1rem;
      line-height: 2.2rem;
      color: #1D242F;
@media screen and (max-width: 1200px)
  .newsmain
    width:90%
    margin:0 auto
    text-align: left;
    position absolute
    top 60px
    left 0px
    right 0px
@media screen and (max-width: 600px)
  .newsmain
    width:90%
    margin:0 auto
    text-align: left;
    position absolute
    top 60px
    left 0px
    right 0px
</style>
