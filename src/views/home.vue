<template>
  <div class="home-container">
    <el-row>
      <el-col :span="11"  class="home-box" style="background-color: #FF9642">
        <div class="out-border" @click="gotoBook">
          <svg-icon iconClass="egBook" class="home-icon"></svg-icon>
          <div class="home-title">项目资料</div>
        </div>
      </el-col>
      <el-col :span="11" class="home-box" style="background-color: #458B74">
        <div class="out-border" @click="gotoOverall">
          <svg-icon iconClass="totalCheck" class="home-icon"></svg-icon>
          <div class="home-title">总体情况</div>
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="7"  class="home-box" style="background-color: #668d3c">
        <div class="out-border" @click="gotoEgBook">
          <svg-icon iconClass="map" class="home-icon"></svg-icon>
          <div class="home-title">专题图</div>
        </div>
      </el-col>
      <el-col :span="7"  class="home-box" style="background-color: #c0362c">
        <div class="out-border" @click="gotoRecord">
          <svg-icon iconClass="thingRecord" class="home-icon"></svg-icon>
          <div class="home-title">大事记</div>
        </div>
      </el-col>
      <el-col :span="7"  class="home-box" style="background-color: #F08080">
        <div class="out-border" @click="gotoNews">
          <svg-icon iconClass="news" class="home-icon"></svg-icon>
          <div class="home-title">新闻中心</div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>
<script>
  import SvgIcon from "../components/SvgIcon/index.vue";

  export default {
    components: {SvgIcon},
    name: 'home',
    data() {
      return {
      }
    },
    mounted() {

    },
    methods: {
      gotoEgBook(){
        this.$router.push('/thematicmap')
      },
      gotoTable(){
        this.$router.push('/weekreport')
      },
      gotoBook(){
        this.$router.push('/info')
      },
      gotoRecord(){
        this.$router.push('/events')
      },
      gotoOverall(){
        this.$router.push('/overall')
      },
      gotoNews(){
        this.$router.push('/newslist')
      }
    },
  }
</script>

<style lang="stylus">
  .home-container {
    margin: 0px;
    overflow: hidden;
    bottom: 0px;
    right: 0px;
    width: 100%;
    padding: 70px 20px 0px 20px;
  }

  .out-border {
    border: 1px solid #DCDFE6;
    position: relative;
  }

  .home-box{
    margin 2%;
    -webkit-box-shadow:0px 1px 1px #c8c8c8 ;
    -moz-box-shadow:0px 1px 1px #c8c8c8 ;
    box-shadow:0px 1px 1px #c8c8c8 ;
    cursor pointer
  }

  .home-box:hover{
    margin 2%;
    -webkit-box-shadow:0px 3px 3px #c8c8c8 ;
    -moz-box-shadow:0px 3px 3px #c8c8c8 ;
    box-shadow:0px 3px 3px #c8c8c8 ;
  }

  .home-title{
    padding 85px 10px 40px 10px
    font-size 1.0rem
    text-align: center;
    color #fff
  }

  .home-icon{
    width 45px !important;
    height 45px !important;
    position absolute
    margin auto
    left 0px
    right 0px
    margin-top 25px
  }
</style>
