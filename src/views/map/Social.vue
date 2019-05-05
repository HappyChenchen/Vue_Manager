<template>
  <div class="root" style="width: 100%">
    <ChartGradingMap id="socialMap"  class="map" :chartType="type" :chartData="chartData" :geojson="geojson" :data="resultData" :startColor="startColor" :endColor="endColor" :classifyLevel="classifyLevel" :cityPicker="cityPicker"></ChartGradingMap>
    <CityPicker class="picker" @selected="selected"/>
    <el-select class="type-select" v-model="value" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value">
      </el-option>
    </el-select>
  </div>
</template>

<script>
import ChartGradingMap from '../../components/Map/ChartGradingMap'
// import Map from '../view/GradingMap'
// import axios from 'axios'
import CityPicker from '../picker/CityPicker'
export default {
  name: 'Social',
  components: { ChartGradingMap, CityPicker },
  data () {
    return {
      // dataJson: '../../../static/json/data.json',
      // mapJson: '../../../static/json/520000.json',
      type: 1,
      options: [{
        value: 'population',
        label: '人口'
      }, {
        value: 'gdp',
        label: '经济数据'
      }],
      value: 'population',
      cityPicker: [120100],
      chartData: [],
      geojson: {},
      resultData: [],
      startColor: 'rgba(205,255,95,1)',
      endColor: 'rgba(12,120,67,1)',
      classifyLevel: 5
    }
  },
  methods: {
    initChartData () {
      let that = this
      let pac = this.cityPicker[this.cityPicker.length - 1]
      this.$store.dispatch('Region', pac).then((response) => {
        that.geojson = response.data
      })
      let param = {}
      param.pac = pac
      param.type = this.value

      this.$store.dispatch('SocialMap', param).then((response) => {
        that.resultData = response.data
      })
      this.$store.dispatch('SocialChart', pac).then((response) => {
        that.chartData = response.data
      })
      // axios.get(this.mapJson).then(response => {
      //   if (response.status === 200) {
      //     that.geojson = response.data
      //   } else {
      //     console.log(response.status)
      //   }
      // }).catch(function (error) {
      //   console.log(error)
      // })
      // axios.get(this.dataJson).then(response => {
      //   if (response.status === 200) {
      //     that.chartData = response.data
      //   } else {
      //     console.log(response.status)
      //   }
      // }).catch(function (error) {
      //   console.log(error)
      // })
    },
    selected (value) {
      this.cityPicker = value
      this.initChartData()
    }
    // change () {
    //   this.startColor = 'rgba(205,128,95,1)'
    //   this.endColor = 'rgba(152,120,67,1)'
    //   this.classifyLevel = 6
    // }
  },
  mounted () {
    this.initChartData()
  }
}
</script>

<style lang="stylus">
  #socialMap
    position absolute
    top 70px
    left 0px
    right 0px
    bottom 0px
  .picker
    position: absolute;
    top: 90px;
    left: 50px;
  .type-select
    width: 110px;
    top: 90px;
    position: absolute;
    z-index: 99;
    left: 250px;
  .el-input__inner
    height: 35px
    line-height: 35px
  @media screen and (min-width: 768 px) and (max-width: 1200px)
    #socialMap
      position absolute
      top 130px
      left 0px
      right 0px
      bottom 0px
    .picker
      position: absolute;
      top: 150px;
      left: 50px;
    .type-select
      width: 110px;
      top: 150px;
      position: absolute;
      z-index: 99;
      left: 250px;
    .el-input__inner
      height: 35px
      line-height: 35px
  @media screen and (min-width: 480 px) and (max-width: 768px)
    #socialMap
      position absolute
      top 130px
      left 0px
      right 0px
      bottom 0px
    .picker
      position: absolute;
      top: 150px;
      left: 50px;
    .cascader-menu-list
      min-width 50px
      width 90px
    .type-select
      width: 110px;
      top: 150px;
      position: absolute;
      z-index: 99;
      left: 250px;
    .el-input__inner
      height: 35px
      line-height: 35px
  @media screen and (max-width: 480px)
    #socialMap
      position absolute
      top 190px
      left 0px
      right 0px
      bottom 0px
    .picker
      position: absolute;
      top: 210px;
      left: 50px;
    .cascader-menu-list
      min-width 50px
      width 90px
    .type-select
      width: 110px;
      top: 210px;
      position: absolute;
      z-index: 99;
      left: 250px;
    .el-input__inner
      height: 35px
      line-height: 35px
</style>
