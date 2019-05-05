<template>
  <div id="chartPage">
    <!--<div id = 'mapDiv'></div>-->
    <Map @mapView="setMap"/>
    <!--<div id="menu">-->
      <!--<el-select v-model="statisticType" placeholder="请选择统计方式" @change="drawChartOnMap">-->
        <!--<el-option-->
          <!--v-for="item in statisticTypes"-->
          <!--:key="item.code"-->
          <!--:label="item.name"-->
          <!--:value="item.code">-->
        <!--</el-option>-->
      <!--</el-select>-->
    <!--</div>-->
    <el-switch
      style="display: block;position: absolute;bottom: 10px;right: 20px;"
      v-model="isShowChart"
      active-color="#13ce66"
      inactive-color="#ff4949"
      :active-text="activeText"
      ref="switch"
      @change="changeShowChart">
    </el-switch>
   <!-- <image src="../../assets/img/food.png" style="position: absolute;top: 20px;"/>-->
  </div>
</template>

<script>
import 'ol/ol.css'
import {Overlay} from 'ol'
import OverlayPositioning from 'ol/OverlayPositioning'
import {fromLonLat} from 'ol/proj.js'
import Map from './Map'
// 之后定义在全局变量文件中
const BASEIMGPATH = '../../static/img/'
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
      validate: (value) => [0, 1, 2, 3, 4].indexOf(value) > -1
    },
    industryType: {
      type: String,
      default: ''
    }
  },
  data: function () {
    return {
      statisticType: 'pie',
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
      }, {
        code: 'NestedRing',
        name: '嵌套环形图'
      }, {
        code: 'CouplingRing',
        name: '耦合环形图'
      }],
      chartWidth: 140,
      chartHeight: 140,
      regionId: '520000',
      colorArray: ['#fb734e', '#e32f46', '#94d96c', '#0bbcb7', '#1a9bfc', '#7049f0', '#4ac7f5', '#42a4eb', '#5f71d2', '#f36f8a', '#fd9173', '#22C3AA'],
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
        case 4:
          this.statisticType = 'NestedRing'
          break
      }
      if (this.chartData && this.chartData.length !== 0) { this.drawChartOnMap() }
    },
    init () {
      let that = this
      this.map.on('moveend', function (e) {
        let zoom = that.map.getView().getZoom()
        let showyaxis = true
        if (that.statisticType === 'bar') {
          // 柱状图
          if (that.regionId.length === 6) {
            if (zoom <= 8) {
              that.chartWidth = 150
              that.chartHeight = 150
              showyaxis = false
            } else if (zoom <= 12) {
              that.chartWidth = zoom * 17
              that.chartHeight = zoom * 17
              showyaxis = false
            } else {
              that.chartWidth = zoom * 20 + 10
              that.chartHeight = zoom * 20 + 10
              showyaxis = true
            }
          } else {
            if (zoom <= 8) {
              that.chartWidth = 150
              that.chartHeight = 150
            } else if (zoom <= 12) {
              that.chartWidth = zoom * 15
              that.chartHeight = zoom * 15
            } else {
              that.chartWidth = zoom * 17 + 10
              that.chartHeight = zoom * 17 + 10
            }
          }
        } else if (that.statisticType === 'NestedRing') {
          // 嵌套环形图
          if (that.regionId.length === 6) {
            if (zoom <= 8) {
              that.chartWidth = 500
              that.chartHeight = 150
            } else if (zoom <= 12) {
              that.chartWidth = zoom * 20 + 300
              that.chartHeight = zoom * 17
            } else {
              that.chartWidth = zoom * 20 + 400
              that.chartHeight = zoom * 20
            }
          }
          // 非省级用户 暂未使用
          else {
            if (zoom <= 8) {
              that.chartWidth = 150
              that.chartHeight = 150
            } else if (zoom <= 12) {
              that.chartWidth = zoom * 15
              that.chartHeight = zoom * 15
            } else {
              that.chartWidth = zoom * 17 + 10
              that.chartHeight = zoom * 17 + 10
            }
          }
        } else {
          if (that.regionId.length === 6) {
            if (zoom <= 8) {
              that.chartWidth = 140
              that.chartHeight = 140
            } else if (zoom <= 12) {
              that.chartWidth = zoom * 10 + 80
              that.chartHeight = zoom * 10 + 80
            } else {
              that.chartWidth = zoom * 12 + 10
              that.chartHeight = zoom * 12 + 10
            }
          } else {
            if (zoom <= 8) {
              that.chartWidth = 60
              that.chartHeight = 60
            } else if (zoom <= 12) {
              that.chartWidth = zoom * 6
              that.chartHeight = zoom * 6
            } else {
              that.chartWidth = zoom * 8 + 10
              that.chartHeight = zoom * 8 + 10
            }
          }
        }

        for (let i = 0; i < that.map.getOverlays().getLength(); i++) {
          let dom = document.getElementById('chart' + i)
          if (dom === null) { return }
          dom.style.width = that.chartWidth + 'px'
          dom.style.height = that.chartHeight + 'px'
          var myChart = that.$echarts.getInstanceByDom(dom) // 通过DOM id获取到echarts实例
          if (that.statisticType === 'bar') {
            myChart.setOption({yAxis: {show: showyaxis}})
          }
          if (that.statisticType === 'NestedRing') {
            if (zoom > 10) {
              myChart.setOption({series: [{label: {show: true}}, {label: {show: true}}]})
            } else {
              myChart.setOption({series: [{label: {show: false}}, {label: {show: false}}]})
            }
          }
          /* if(that.statisticType==='radar'&&zoom>10){
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
          } */
          myChart.resize()
          myChart.setOption({title: {textStyle: {fontSize: zoom}}})
        }
      })
      if (this.chartData && this.chartData.length !== 0) { this.drawChartOnMap() }
    },
    setMap (value) {
      this.map = value
      this.init()
    },
    drawChartOnMap () {
      if (!this.map) { return }
      if (this.initTimer) {
        clearTimeout(this.initTimer)
      }
      let that = this
      this.initTimer = setTimeout(function () {
        that.removeAllOverLays()
        if (that.statisticType === 'NestedRing') {
          that.map.getView().setCenter([105.24893656779955, 25.050033147968733])
          that.map.getView().setZoom(11)
          that.chartWidth = that.chartWidth * 2
          var image = new Image()
          image.src = './static/img/' + that.industryType + '.png'
          image.onload = function () {
            var suboption = {
              series: [{
                type: 'graph',
                layout: 'none',
                name: that.industryType,
                data: [{
                  x: 0,
                  y: 0,
                  symbolSize: 25
                }],
                symbol: 'image://./static/img/' + that.industryType + '.png'
              }]
            }
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
              let options = that.setEchartOption(that.statisticType, d, title)
              mychart.setOption(options)
              mychart.setOption(suboption)
              window.addEventListener('resize', () => {
                mychart.resize()
              })
              that.map.addOverlay(chartLayer)
            }
          }
        } else if (that.statisticType === 'radar') {
          that.map.getView().setCenter([106.713478,26.578343])
          that.map.getView().setZoom(9)
          for (let i = 0; i < that.chartData.length; i++) {
            let d = that.chartData[i]
            let domid = 'chart' + i
            let nodechart = document.createElement('div')
            nodechart.id = domid
            nodechart.setAttribute('class', 'mychart')
            nodechart.style.width = that.chartWidth + 'px'
            nodechart.style.height = that.chartHeight + 'px'
            let pt = fromLonLat([d.centerX, d.centerY], 'EPSG:4326')
            let chartLayer = new Overlay({
              position: pt,
              positioning: OverlayPositioning.CENTER_CENTER,
              element: nodechart
            })
            let mychart = that.$echarts.init(nodechart)
            let title = d.name
            let options = that.setEchartOption(that.statisticType, d, title)
            mychart.setOption(options)
            window.addEventListener('resize', () => {
              mychart.resize()
            })
            that.map.addOverlay(chartLayer)
          }
        } else {
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
            let options = that.setEchartOption(that.statisticType, d, title)
            mychart.setOption(options)
            window.addEventListener('resize', () => {
              mychart.resize()
            })
            that.map.addOverlay(chartLayer)
          }
        }

        /* this.$nextTick(function () {
          this.setOverlaysCenter()
        }) */
        that.map.render()
      }, 300)
    },
    setEchartOption (type, alldata, title) {
      let that = this
      let option = {}
      let xData = []
      let values = []
      let min = 10000000000
      let max = -10000000000
      let indicator = []
      let data = null
      if (type !== 'radar') {
        data = alldata.data
        data.forEach(item => {
          let obj = {}
          obj.name = item.name
          if (min > item.value) { min = item.value }
          if (max < item.value) { max = item.value }
          xData.push(item.name)
          values.push(item.value)
          indicator.push(obj)
        })
      } else {
        // 景观指数
        data = alldata
        for (var key in data) {
          let obj = {}
          let array = ['centerX', 'centerY', 'pac', 'ComIndex']
          if (array.indexOf(key) !== -1) {
            continue
          }
          obj.text = that.getIndicatorName(key)
          obj.max = 1
          obj.min = 0
          if (min > data[key]) { min = data[key] }
          if (max < data[key]) { max = data[key] }
          xData.push(that.getIndicatorName(key))
          values.push(data[key].toFixed(2))
          indicator.push(obj)
        }
      }

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
                var obj = {top: 10}
                obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 30
                return obj
              }
            },
            xAxis: {
              data: xData,
              show: true,
              axisLabel: {
                formatter: (text) => {
                  text = text.replace(/\S{1}/g, function (match) {
                    return match + '\n'
                  })
                  return text
                }
              },
              color: '#333'
            },
            yAxis: {
              name: 'y',
              nameGap: 15,
              show: false,
              axisLabel: {
                margin: 5,
                interval: 0,
                rotate: 0,
                show: true,
                splitNumber: 30,
                // color:"#fff",
                textStyle: {
                  // fontFamily: "微软雅黑",
                  fontSize: 12
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
                var res = params.name + ':' + params.value + '<br/>'
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
                var obj = {top: 10}
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
            tooltip: {

            },
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
              /* axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
              } */
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
            radar: {
              center: ['50%', '50%'],
              radius: '50%',
              startAngle: 90,
              splitNumber: 4,
              // shape: 'circle',
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
                padding: [1, 1, 1, 1],
                fontSize: '8',
                formatter: (text) => {
                  if (this.chartWidth < 100) {
                    return ''
                  } else if (this.chartWidth >= 100 && this.chartWidth < 170) {
                    text = text.replace(/\S{4}/g, function (match) {
                      return match + '\n'
                    })
                    return text
                  } else {
                    return text
                  }
                }
              },
              nameGap: 1,
              /*  splitArea:
                {
                  areaStyle: {
                    color: ['transparent']
                  }
                }, */
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
              zlevel: 2,
              symbol: 'circle',
              symbolSize: 10,
              lineStyle: {
                width: 1,
                opacity: 1
              },
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
            },
            {
              type: 'sunburst',
              center: ['50%', '50%'],
              nodeClick: false,
              levels: [{},
                {
                  r0: '85%',
                  r: '95%'
                }
              ],
              sort: null,
              data: [{
                name: '景观破碎化指数',
                value: data.ComIndex,
                label: {
                  position: 'inside',
                  rotate: 'tangential',
                  padding: [1, 1, 1, 1],
                  align: 'center',
                  //minAngle: 90,
                  fontSize: '10',
                  verticalAlign: 'center'
                },
                itemStyle: {
                  color: '#1a9bfc'

                }
              },
              {
                name: '',
                value: 1 - data.ComIndex,
                label: {
                  show: false
                },
                itemStyle: {
                  color: '#eee',
                  fontSize: '9'
                }
              }

              ]

            }]
            /* coordinateSystem: 'polar' */
          }
          break
        case 'NestedRing':
          option = {
            tooltip: {
              trigger: 'item',
              // formatter: '{a} <br/>{b}: {c} ({d}%)'
              formatter: (params) => {
                console.log(params.componentSubType)
                if (params.componentSubType === 'graph') { return params.seriesName } else { return params.seriesName + '<br/>' + params.name + ': ' + params.value + '(' + params.percent + '%)' }
              }
            },
            series: [
              {
                name: '产业扶贫',
                type: 'pie',
                radius: ['20%', '35%'],
                data: data,
                itemStyle: {
                  color: (params) => {
                    if (params.name === '参加产业扶贫户数') {
                      return new this.$echarts.graphic.LinearGradient(0, 0, 1, 1, [{
                        offset: 0,
                        color: '#7777eb'
                      }, {
                        offset: 1,
                        color: '#70ffac'
                      }])
                    } else {
                      return '#999'
                    }
                  }
                },
                label: {
                  show: false,
                  color: '#333'
                }
              },
              {
                name: '产业扶贫',
                type: 'pie',
                radius: ['40%', '55%'],
                label: {
                  normal: {
                    show: false,
                    formatter: '{a|{a}}{abg|}\n{hr|}\n  {b|{b}：}{c}\n  {per|{d}%}  ',
                    backgroundColor: '#eee',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    // shadowBlur:3,
                    // shadowOffsetX: 2,
                    // shadowOffsetY: 2,
                    // shadowColor: '#999',
                    // padding: [0, 7],
                    rich: {
                      a: {
                        color: '#333',
                        lineHeight: 14,
                        align: 'center'
                      },
                      // abg: {
                      //     backgroundColor: '#333',
                      //     width: '100%',
                      //     align: 'right',
                      //     height: 22,
                      //     borderRadius: [4, 4, 0, 0]
                      // },
                      hr: {
                        borderColor: '#333',
                        width: '100%',
                        borderWidth: 0.5,
                        height: 0
                      },
                      b: {
                        fontSize: 12,
                        lineHeight: 20,
                        color: '#333'

                      },
                      c: {
                        color: '#333'
                      },
                      per: {
                        color: '#eee',
                        backgroundColor: '#7777eb',
                        padding: [2, 4],
                        borderRadius: 2,
                        align: 'center'
                      }
                    }
                  }
                },
                data: alldata.data1,
                itemStyle: {
                  color: (params) => {
                    if (params.name === '因产业扶贫脱贫的户数' & params.value != 0) {
                      return new that.$echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#7049f0'
                      }, {
                        offset: 1,
                        color: '#1a9bfc'
                      }])
                    } else {
                      return '#999'
                    }
                  }
                }
              },
              {
                type: 'graph',
                layout: 'none',
                name: that.industryType,
                data: [{
                  x: 0,
                  y: 0,
                  symbolSize: 25
                }],
                symbol: 'image://./static/img/' + that.industryType + ' .png'
              }
            ]
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
    },
    getIndicatorName (text) {
      switch (text) {
        case 'NP':
          return '斑块数量'
          break
        case 'PD':
          return '斑块密度'
          break
        case 'LPI':
          return '最大斑块指数'
          break
        case 'ED':
          return '边缘密度'
          break
        case 'LSI':
          return '最大形状指数'
          break
        case 'COHESION':
          return '斑块内聚力指数'
          break
        case 'DIVISION':
          return '景观分离度'
          break
        case 'SPLIT':
          return '分散指数'
          break
        case 'AI':
          return '聚合度'
          break
        case 'ComIndex':
          return '破碎化指数'
          break
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
        if (this.chartData && this.chartData.length !== 0) { this.drawChartOnMap() }
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  #chartPage
    position absolute
    top 0px
    left 0px
    right 0px
    bottom 0px
  @media screen and (min-width: 768 px) and (max-width: 1200px)
    #chartPage
      position absolute
      top 130px
      left 0px
      right 0px
      bottom 0px
  @media screen and (min-width: 480 px) and (max-width: 768px)
    #chartPage
      position absolute
      top 130px
      left 0px
      right 0px
      bottom 0px
  @media screen and (max-width: 480px)
    #chartPage
      position absolute
      top 190px
      left 0px
      right 0px
      bottom 0px
</style>
