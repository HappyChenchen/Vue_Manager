<template>
  <div>
    <Map @mapView="setMap" :geojson="geojson" :data="data" :startColor="startColor" :endColor="endColor"
         :classifyLevel="classifyLevel"/>
    <el-switch
      style="display: block;position: absolute;bottom: 10px;right: 20px;"
      v-model="isShowChart"
      active-color="#13ce66"
      inactive-color="#ff4949"
      :active-text="activeText"
      ref="switch"
      @change="changeShowChart">
    </el-switch>
  </div>
</template>

<script>
import 'ol/ol.css'
import {Overlay} from 'ol'
import OverlayPositioning from 'ol/OverlayPositioning'
import {fromLonLat} from 'ol/proj.js'
import Map from './GradingMap'

export default {
  name: 'Chart',
  components: {Map},
  props: {
    chartData: {
      type: Array,
      default: () => []
    },
    chartType: {
      type: Number,
      default: 0,
      validate: (value) => [0, 1, 2, 3].indexOf(value) > -1
    },
    data: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 0,
      validate: (value) => [0, 1].indexOf(value) > -1
    },
    startColor: {
      type: String,
      default: 'rgba(205,255,95,1)'
    },
    endColor: {
      type: String,
      default: 'rgba(12,120,67,1)'
    },
    classifyLevel: {
      type: Number,
      default: 5
    },
    geojson: {
      type: Object,
      default: () => {
      }
    },
    cityPicker: {
      type: Array,
      default: () => ['520000'],
      required: false
    }
  },
  data: function () {
    return {
      statisticType: 'bar',
      statisticTypes: [{
        code: 'pie',
        name: '饼状图'
      }, {
        code: 'bar',
        name: '柱状图'
      },
      {
        code: 'piehalfRose',
        name: '玫瑰图'
      },
      {
        code: 'radar',
        name: '雷达图'
      }],
      chartWidth: 150,
      chartHeight: 150,
      pac: '520000',
      colorArray: ['#FFA014','#497AFF', '#e32f46', '#94d96c', '#0bbcb7', '#1a9bfc', '#7049f0', '#4ac7f5', '#42a4eb', '#5f71d2', '#f36f8a', '#fd9173', '#22C3AA'],
      colorArray1:['#FFB200 ','#3EA2FF'],//用于渐变
      isShowChart: true,
      activeText: '显示统计图'
    }
  },
  methods: {
    setType () {
      switch (this.chartType) {
        case 0:
          this.statisticType = 'pie'
          break
        case 1:
          this.statisticType = 'bar'
          break
        case 2:
          this.statisticType = 'piehalfRose'
          break
        case 3:
          this.statisticType = 'radar'
          break
      }
      if (this.chartData && this.chartData.length !== 0) {
        this.drawChartOnMap()
      }
    },
    init () {
      let that = this
      /*  this.Map.on('moveend', function (e) {
        let zoom = that.Map.getView().getZoom()
        let showyaxis = true
        if (that.statisticType === 'bar') {
          // 柱状图
          if (that.pac.toString().indexOf('00') !== -1) {
            if (zoom <= 8) {
              that.chartWidth = 110
              that.chartHeight = 110
              showyaxis = false
            } else if (zoom <= 14) {
              that.chartWidth = zoom * 6 + 50
              that.chartHeight = zoom * 7 + 50
              showyaxis = false
            } else {
              that.chartWidth = zoom * 7 + 60
              that.chartHeight = zoom * 8 + 60
              showyaxis = true
            }
          } else {
            if (zoom <= 11) {
              that.chartWidth = 110
              that.chartHeight = 110
              showyaxis = false
            } else if (zoom <= 13) {
              that.chartWidth = zoom * 6 + 50
              that.chartHeight = zoom * 7 + 50
              showyaxis = false
            } else {
              that.chartWidth = zoom * 7 + 60
              that.chartHeight = zoom * 8 + 60
              showyaxis = true
            }
          }

          for (let i = 0; i < that.Map.getOverlays().getLength(); i++) {
            let dom = document.getElementById('chart' + i)
            if (dom === null) {
              return
            }
            dom.style.width = that.chartWidth + 'px'
            dom.style.height = that.chartHeight + 'px'
            let myChart = that.$echarts.getInstanceByDom(dom) // 通过DOM id获取到echarts实例
            if (that.statisticType === 'bar') {
              myChart.setOption({yAxis: {show: showyaxis}})
            }
            /!* if(that.statisticType==='radar'&&zoom>10){
              myChart.setOption({radar:{name:{show:true, formatter:(text)=>{
                    if(that.chartWidth<100){
                      return ''
                    }else if(that.chartWidth>=100&&that.chartWidth<170){
                      text=text.replace(/\S{2}/g,function (match) {
                        return match+'\n'
                      })
                      return text
                    }else{
                      return text
                    }
                  }}}})
            } *!/
            myChart.resize()
            myChart.setOption({title: {textStyle: {fontSize: zoom}}})
          }
        }
      }) */
      if (this.chartData && this.chartData.length !== 0) {
        this.drawChartOnMap()
      }
    },
    setMap (value) {
      this.map = value
      this.init()
    },
    drawChartOnMap () {
      if (!this.map) {
        return
      }
      if (this.initTimer) {
        clearTimeout(this.initTimer)
      }
      let that = this
      this.initTimer = setTimeout(function () {
        that.removeAllOverLays()
        for (let i = 0; i < that.chartData.length; i++) {
          let d = that.chartData[i]
          let domid = 'chart' + i
          let nodechart = document.createElement('div')
          nodechart.id = domid
          nodechart.setAttribute('class', 'mychart')
          nodechart.style.width = that.chartWidth + 'px'
          nodechart.style.height = that.chartHeight + 'px'
          let pt = fromLonLat([d.x, d.y], 'EPSG:4326')
          let chartLayer = new Overlay({
            position: pt,
            positioning: OverlayPositioning.CENTER_CENTER,
            element: nodechart
          })
          let mychart = that.$echarts.init(nodechart)
          let title = d.name
          let options = that.setEchartOption(that.statisticType, d.data, title)
          mychart.setOption(options)
          window.addEventListener('resize', () => {
            mychart.resize()
          })
          that.map.addOverlay(chartLayer)
        }
        /* this.$nextTick(function () {
            this.setOverlaysCenter()
          }) */
        that.map.render()
      }, 300)
    },
    setEchartOption (type, data, title) {
      let that = this
      let option = {}
      let xData = []
      let values = []
      let min = 10000000000
      let max = -10000000000
      let indicator = []
      data.forEach(item => {
        let obj = {}
        obj.text = item.name
        if (min > item.value) {
          min = item.value
        }
        if (max < item.value) {
          max = item.value
        }
        xData.push(item.name)
        values.push(item.value)
        indicator.push(obj)
      })
      switch (type) {
        case 'bar':
          option = {
            title: {
              show: false,
              text: title,
              textStyle: {
                fontSize: 14
              }
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              backgroundColor: 'rgba(245, 245, 245, 0.8)',
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              textStyle: {
                color: '#000',
                fontSize: 11
              },
              position: function (pos, params, el, elRect, size) {
                let obj = {top: 10}
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
                return obj
              }
            },
            xAxis: {
              type: 'category',
              data: xData,
              show: true,
              axisLabel: {
                formatter: (text) => {
                  // 垂直排列
                  /* text = text.replace(/\S{1}/g, function (match) {
                    return match + '\n'
                  }) */
                  return text
                },
                textStyle: {
                  //fontFamily: "微软雅黑",
                  fontSize: 14,
                  fontWeight:'bolder',
                },
                // 数据少时设置全部显示
                interval: 0
              },
              color: '#333'
            },
            yAxis: {
              name: '',
              nameGap: 15,
              show: false,
              axisLabel: {
                margin: 5,
                interval: 0,
                rotate: 0,
                show: true,
                // splitNumber: 30,
                // color:"#fff",
                textStyle: {
                   fontFamily: "微软雅黑",
                   fontSize: 12,
                   fontWeight:'bolder',
                }
              },
              splitLine: {
                show: false
              }

            },
            grid: {
              left: '15%'
            },
            series: [{
              name: 'value',
              type: 'bar',
              data: values,
              barWidth: 20, // 柱图宽度
              itemStyle: {
                emphasis: {
                  barBorderRadius: [10, 10, 0, 0]
                },
                normal: {
                  color: function (params) {
                    // 自定义颜色
                    if (data[params.dataIndex].color !== undefined) {
                      return new that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: data[params.dataIndex].color
                      }, {
                        offset: 1,
                        color: data[params.dataIndex].color
                      }])
                    } else {
                      return new that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: that.colorArray[params.dataIndex % that.colorArray.length]
                      }, {
                        offset: 1,
                        color: that.colorArray1[(params.dataIndex) % that.colorArray1.length]
                      }])
                    }
                  },
                  //柱形图圆角，初始化效果
                  barBorderRadius:[10, 10, 0, 0]
                }
              }
            }]
          }
          // this.chartHeight = 200
          break
        case 'pie':

          // 饼状图
          option = {
            title: {show: false, text: title, textStyle: {fontSize: 14}, x: 'center', y: '20%'},
            tooltip: {
              trigger: 'item',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              },
              /* formatter: '{b} : {c} ({d}%)', */
              formatter: function (params) {
                let res = params.name + ':' + params.value + '<br/>'
                res += params.percent + '%</br>'
                return res
              },
              backgroundColor: 'rgba(245, 245, 245, 0.8)',
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 10,
              textStyle: {
                color: '#000'
              },
              position: function (pos, params, el, elRect, size) {
                let obj = {top: 10}
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 10
                return obj
              }
            },
            calculable: true,
            series: [
              {
                name: '',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: data,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: function (params) {
                      // 自定义颜色
                      if (data[params.dataIndex].color !== undefined) {
                        return data[params.dataIndex].color
                      } else {
                        return that.colorArray[params.dataIndex % that.colorArray.length]
                      }
                    }
                  }
                }
              }
            ]
          }
          break
        case 'piehalfRose':
          option = {
            toolbox: {
              show: false,
              feature: {
                mark: {
                  show: true
                },
                dataView: {
                  show: true,
                  readOnly: false
                },
                magicType: {
                  show: true,
                  type: ['pie', 'funnel']
                },
                restore: {
                  show: true
                },
                saveAsImage: {
                  show: true
                }
              }
            },
            calculable: true,
            tooltip: {},
            series: [
              {
                name: '',
                type: 'pie',
                radius: [
                  10,
                  25
                ],
                center: ['50%', '60%'],
                avoidLabelOverlap: false,
                startAngle: 0,
                roseType: 'area',
                data: data,
                label: {
                  normal: {
                    show: false,
                    position: 'center'
                  }
                },
                labelLine: {
                  normal: {
                    show: false
                  }
                },
                itemStyle: {
                  normal: {
                    color: function (params) {
                      // 自定义颜色
                      if (data[params.dataIndex].color !== undefined) {
                        return data[params.dataIndex].color
                      } else {
                        return that.colorArray[params.dataIndex % that.colorArray.length]
                      }
                    }
                  }
                }
              }
            ]
          }
          break
        case 'radar':
          let datas = []
          let obj = {}
          obj.value = values
          datas.push(obj)
          option = {
            title: {show: false, text: title, textStyle: {fontSize: 14}, x: 'center', y: '20%'},
            tooltip: {
              trigger: 'item',
              axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              }
            },
            radar: {
              center: ['50%', '50%'],
              radius: '60%',
              startAngle: 90,
              splitNumber: 4,
              shape: 'circle',
              /* grid:{
                  show:false,
                  top:'10%',
                  left:'10%',
                  bottom:'10%',
                  right:'10%'
                }, */
              name: {
                show: true,
                color: '#333',
                // padding: [1,1,1,1],
                fontSize: '12'
                /* formatter:(text)=>{
                    if(this.chartWidth<100){
                      return ''
                    }else if(this.chartWidth>=100&&this.chartWidth<170){
                        text=text.replace(/\S{2}/g,function (match) {
                        return match+'\n'
                      })
                      return text
                    }else{
                      return text
                    }
                  } */
              },
              nameGap: 1,
              splitArea:
                  {
                    areaStyle: {
                      color: ['transparent']
                    }
                  },
              axisLine: {
                show: true,
                lineStyle: {
                  color: '#333'//
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: '#333'//
                }
              },
              indicator: indicator
            },
            series: [{
              name: '',
              type: 'radar',
              symbol: 'circle',
              symbolSize: 10,
              data: datas,
              areaStyle: {
                normal: {
                  /* color: function (params) {
                      // 自定义颜色
                      if (data[params.dataIndex].color !== undefined) {
                        return data[params.dataIndex].color
                      } else {
                        return that.colorArray[params.dataIndex % that.colorArray.length]
                      }
                    } */
                  // 径向渐变，前三个参数分别是圆心 x, y 和半径，取值同线性渐变
                  color: {
                    type: 'radial',
                    x: 0.5,
                    y: 0.5,
                    r: 0.5,
                    colorStops: [{
                      offset: 0, color: '#9BE8FF' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#3BD2FF' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  }
                }
              },
              itemStyle: {
                color: '#3BD2FF'
              }
            }],
            coordinateSystem: 'polar'
          }
          break
      }
      return option
    },
    removeAllOverLays () {
      this.map.getOverlays().clear()
    },
    changeShowChart (type) {
      let status = 'none'
      switch (type) {
        case true:
          status = 'block'
          this.activeText = '显示统计图'
          break
        case false:
          status = 'none'
          this.activeText = '隐藏统计图'
          break
      }
      for (let i = 0; i < this.map.getOverlays().getLength(); i++) {
        let dom = document.getElementById('chart' + i)
        if (dom === null) {
          return
        }
        dom.style.display = status
      }
    }

  },
  mounted () {
    // this.initLayerIndex()
    // this.setProps()
  },
  watch: {
    // type (curVal, oldVal) {
    //   this.setProps()
    // },
    chartType: {
      immediate: true,
      handler: function () {
        this.setType()
      }
    },
    chartData: {
      immediate: true,
      handler: function () {
        if (this.chartData && this.chartData.length !== 0) {
          this.drawChartOnMap()
        }
      }
    },
    cityPicker: {
      immediate: true,
      handler: function () {
        this.pac = this.cityPicker[this.cityPicker.length - 1]
      }
    }
  }
}
</script>

<style scoped lang="stylus">

</style>
