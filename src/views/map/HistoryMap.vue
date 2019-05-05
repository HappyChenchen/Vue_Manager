<template>
  <div id='hismap'>
    <div id='mapDiv'></div>
    <div class="myChart" id="timeLine" :style={height:chartHeight}></div>
  </div>
</template>
<script>
  import 'ol/ol.css'
  import {Map, View} from 'ol'
  import TileLayer from 'ol/layer/Tile'
  import {XYZ, TileArcGISRest} from 'ol/source.js'

  var this_ = null
  export default {
    name: 'HistoryMap',
    data() {
      return {
        myChart: null,
        tiandituKey: '60f62b68fd6bbe652ae59aeec34c78f0',
        option: {},
        data: [{
          'type': 0,
          'name': '天地图矢量地图服务',
          'url': 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=60f62b68fd6bbe652ae59aeec34c78f0',
          year: '2002'
        },
          {
            'type': 0,
            'name': '天地图矢量注记服务',
            'url': 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=60f62b68fd6bbe652ae59aeec34c78f0',
            year: '2003'
          },
          {
            'type': 0,
            'name': '天地图影像地图服务',
            'url': 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=60f62b68fd6bbe652ae59aeec34c78f0',
            year: '2004'
          },
          {
            'type': 0,
            'name': '天地图影像注记服务',
            'url': 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}&tk=60f62b68fd6bbe652ae59aeec34c78f0',
            year: '2005'
          }],
        layers: [],
        years: [],
        lastIndex: 0,
        chartHeight: 60 + 'px',
        mapHeight: (window.innerHeight - 80) + 'px',
      }
    },
    methods: {
      init() {
        this_ = this
        this.map = new Map({
          target: 'mapDiv',
          view: new View({
            center: [106.63, 26.65],
            projection: 'EPSG:4326',
            zoom: 8
          })
        })
        // this.vectorLayer = new TileLayer({
        //   title: '天地图矢量地图服务',
        //   source: new XYZ({
        //     crossOrigin: 'anonymous',
        //     url: 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}'
        //   })
        // })
        // this.vectorAnnoLayer = new TileLayer({
        //   title: '天地图矢量注记服务',
        //   source: new XYZ({
        //     crossOrigin: 'anonymous',
        //     url: 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        //   })
        // })
        // this.imageLayer = new TileLayer({
        //   title: '天地图影像地图服务',
        //   source: new XYZ({
        //     crossOrigin: 'anonymous',
        //     url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        //   })
        // })
        // this.imageAnnoLayer = new TileLayer({
        //   title: '天地图影像注记服务',
        //   source: new XYZ({
        //     crossOrigin: 'anonymous',
        //     url: 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}'
        //   })
        // })
        // this.vectorLayer.setZIndex(this.vectorLayerIndex)
        // this.vectorAnnoLayer.setZIndex(this.vectorAnnoLayerIndex)
        // this.imageLayer.setZIndex(this.imageLayerIndex)
        // this.imageAnnoLayer.setZIndex(this.imageAnnoLayerIndex)
        // this.map.addLayer(this.vectorLayer)
        // this.map.addLayer(this.vectorAnnoLayer)
        // this.map.addLayer(this.imageLayer)
        // this.map.addLayer(this.imageAnnoLayer)
        // this.changeMap(0)
      },
      addData() {
        // this.$store.dispatch('HistoryMap').then((response) => {
        //      this.data = response.data
        // })
        for (let i = 0; i < this.data.length; i++) {
          let layer = this.data[i]
          let tileLayer
          let name = layer.name
          let url = layer.url
          let year = layer.year
          this.years.push(year)
          switch (layer.type) {
            case 0: // 天地图
              tileLayer = new TileLayer({
                title: name,
                source: new XYZ({
                  crossOrigin: 'anonymous',
                  url: url + '&tk=' + this.tiandituKey
                })
              })
              break
            case 1:
              tileLayer = new TileLayer({
                title: name,
                source: new TileArcGISRest({
                  crossOrigin: 'anonymous',
                  url: url
                })
              })
              break
          }
          if (tileLayer) {
            tileLayer.setVisible(false)
            this.layers[year] = tileLayer
            this.map.addLayer(tileLayer)
          }
        }
        this.years = this.years.sort()
        this.initData()
        this.drawChart()
        this.changeMap(this.lastIndex, true)
      },
      changeMap(index, isShow) {
        this.layers[this.years[index]].setVisible(isShow)
      },
      // initLayerIndex () {
      //   this.vectorLayerIndex = 0
      //   this.vectorAnnoLayerIndex = 1
      //   this.imageLayerIndex = 2
      //   this.imageAnnoLayerIndex = 3
      // },
      // changeMap (type) {
      //   if (type === 0) {
      //     this.vectorLayer.setVisible(true)
      //     this.vectorAnnoLayer.setVisible(false)
      //     this.imageLayer.setVisible(false)
      //     this.imageAnnoLayer.setVisible(false)
      //   } else if (type === 1) {
      //     this.vectorLayer.setVisible(false)
      //     this.vectorAnnoLayer.setVisible(true)
      //     this.imageLayer.setVisible(false)
      //     this.imageAnnoLayer.setVisible(false)
      //   } else if (type === 2) {
      //     this.vectorLayer.setVisible(false)
      //     this.vectorAnnoLayer.setVisible(false)
      //     this.imageLayer.setVisible(true)
      //     this.imageAnnoLayer.setVisible(false)
      //   } else if (type === 3) {
      //     this.vectorLayer.setVisible(false)
      //     this.vectorAnnoLayer.setVisible(false)
      //     this.imageLayer.setVisible(false)
      //     this.imageAnnoLayer.setVisible(true)
      //   }
      // },
      // addPositionListener () {
      //   Location(this.map)
      // },
      drawChart() {
        // 基于准备好的dom，初始化echarts实例
        this.myChart = this.$echarts.init(document.getElementById('timeLine'))
        this.myChart.setOption(this.option, true)
        this.myChart.on('timelinechanged', function (timeLineIndex) {
          // 设置 每个series里的xAxis里的值
          let arrIndex = parseInt(timeLineIndex.currentIndex)
          // if (arrIndex < 4) {
          //   this_.changeMap(arrIndex)
          // }
          // if (arrIndex > 3) {
          //   this_.changeMap(arrIndex - 4)
          // }
          this_.changeMap(this_.lastIndex, false)
          this_.changeMap(arrIndex, true)
          this_.lastIndex = arrIndex
        })
      },
      initData() {
        this.option = {
          timeline: {
            axisType: 'category',
            autoPlay: false,
            playInterval: 1500,
            data: this.years,
            checkpointStyle: {
              symbol: 'arrow',
              color: '#c21c17',
              symbolRotate: 180
            },
            lineStyle: {
              width: 4
            },
            label: {
              label: 'emphasis',
              color: '#000000',
              fontWeight: 'bold',
              show: true,
              formatter: function (s) {
                return (new Date(s)).getFullYear()
              }
            }
          }
        }
      },
      resizeHandle() {
        if (this.resizeTimer) {
          clearTimeout(this.resizeTimer)
        }
        this.resizeTimer = setTimeout(function () {
          let echartsWarp = document.getElementById('timeLine')
          let main = document.getElementById('main')
          echartsWarp.style.width = (window.innerWidth) * 0.9 + 'px'
          echartsWarp.style.height = (window.innerHeight - 80) / 8 + 'px'
          echartsWarp.style.left = 0
          echartsWarp.style.right = 0
          echartsWarp.style.bottom = 50 + 'px'
          if (this_.option && typeof this_.option === 'object') {
            this_.myChart.setOption(this_.option, true)
          }
          this_.myChart.resize()
        }, 300)
      }
    },
    mounted: function () {
      // this.initLayerIndex()
      this.init()
      this.addData()
      window.addEventListener('resize', this.resizeHandle)
    },
    destroyed: function () {
      window.removeEventListener('resize', this.resizeHandle)
      this.myChart.dispose()
    }
  }
</script>
<style scoped lang="stylus">
  #mapDiv
    height 100%
    width 100%

  #timeLine {
    position: absolute;
    bottom: 50px;
    margin-left auto
    margin-right auto
    left 0px
    right 0px
    width 90%
  }

  #hismap
    position absolute
    top 50px
    left 0px
    right 0px
    bottom 0px

  @media screen and (min-width: 768px) and (max-width: 1200px)
    #timeLine {
      position: absolute;
      bottom: 50px;
      margin-left auto
      margin-right auto
      left 0px
      right 0px
      width 90%
    }

  @media screen and (min-width: 480px) and (max-width: 768px)
    #timeLine {
      position: absolute;
      bottom: 50px;
      margin-left auto
      margin-right auto
      left 0px
      right 0px
      width 90%
    }

  @media screen and (max-width: 480px)
    #timeLine {
      position: absolute;
      bottom: 50px;
      margin-left auto
      margin-right auto
      left 0px
      right 0px
      width 90%
    }
</style>
