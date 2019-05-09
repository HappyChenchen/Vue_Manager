<template>
  <div id = 'mapDiv'>
    <div id="thematicBox">
      <el-row>
        <el-col :span="5" class="theme-box" style="background-color: #1296db">
          <div class="theme-title" @click="goLayer(0)">地图1</div>
        </el-col>
        <el-col :span="6" class="theme-box" style="background-color: #FF9642">
          <div class="theme-title" @click="goLayer(1)">地图2</div>
        </el-col>
        <el-col :span="6" class="theme-box" style="background-color: #458B74">
          <div class="theme-title" @click="goLayer(2)">地图3</div>
        </el-col>
        <el-col :span="5" class="theme-box" style="background-color: #F08080">
          <div class="theme-title" @click="goLayer(3)">地图4</div>
        </el-col>

      </el-row>

      <el-row>
        <el-col :span="5" class="theme-box" style="background-color: #c0362c">
          <div class="theme-title" @click="goLayer(4)">地图5</div>
        </el-col>
        <el-col :span="6" class="theme-box" style="background-color: #9ABD62">
          <div class="theme-title" @click="goLayer(5)">地图6</div>
        </el-col>
        <el-col :span="6" class="theme-box" style="background-color: #FF8247">
          <div class="theme-title" @click="goLayer(6)">地图7</div>
        </el-col>
        <el-col :span="5" class="theme-box" style="background-color: #0097ac">
          <div class="theme-title" @click="goLayer(7)">地图8</div>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="5" class="theme-box" style="background-color: #B03060">
          <div class="theme-title" @click="goLayer(8)">地图9</div>
        </el-col>
        <el-col :span="5" class="theme-box" style="background-color: #668d3c">
          <div class="theme-title" @click="goLayer(9)">地图10</div>
        </el-col>
      </el-row>
    </div>
    <div id="layer-switch">
      <el-tooltip class="item" effect="dark" content="图层管理器" placement="left">
        <img src="../../../static/img/layer-control.png" alt="图层管理" @click="changeLayerTreeShow"/>
      </el-tooltip>
    </div>
    <div id="layerTree-container" v-show="isLayerTreeShow">
      <LayerTree :data="treeItems" @selectChange="selectChange"/>
    </div>
    <div id="myLoc">
      <img src="../../../static/img/locate_1f.png" alt="当前位置" @click="myLocation"/>
    </div>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import {Map, View} from 'ol'
  import TileLayer from 'ol/layer/Tile'
  import {XYZ, TileArcGISRest} from 'ol/source.js'
  import {LocationWatch, CenterAt} from '../../android/location'
  import LayerTree from './LayerTree'
  var that=null
  export default {
    name: 'thematicMap',
    data () {
      return {
        isLayerTreeShow: false,
        layers: {},
        treeItems: [],
        tiandituKey: '###',
        data: [{'type': 0, 'name': '天地图矢量地图服务', 'url': 'http://t3.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}', index: 2},
          {'type': 0, 'name': '天地图矢量注记服务', 'url': 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}', index: 3},
          {'type': 0, 'name': '天地图影像地图服务', 'url': 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}', index: 0},
          {'type': 0, 'name': '天地图影像注记服务', 'url': 'http://t3.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}', index: 1},
        ],
        map: null
      }
    },
    components: { LayerTree },
    methods: {
      init () {
        this.map = new Map({
          target: 'mapDiv',
          view: new View({
            center: [117.210813092,39.1439299033],
            projection: 'EPSG:4326',
            zoom: 12
          })
        })
        let children = []
        for (let i = 0; i < this.data.length; i++) {
          let layer = this.data[i]
          let tileLayer
          let name = layer.name
          let url = layer.url
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
            let key = i.toString()
            tileLayer.setZIndex(layer.index)
            this.layers[key] = tileLayer
            this.map.addLayer(tileLayer)
            let treeItem = {
              layerId: key,
              label: name,
              pngPath: ''
            }
            children.push(treeItem)
          }
        }
        this.treeItems = [{
          layerId: 'allLayers',
          label: '所有图层',
          pngPath: '',
          children: children
        }]
        this.$emit('mapView', this.map)
      },
      changeLayerTreeShow () {
        this.isLayerTreeShow = !this.isLayerTreeShow
      },
      setLayerVisibility (layerId, isVisible) {
        let layer = this.layers[layerId]
        layer.setVisible(isVisible)
      },
      selectChange (layerId) {
        if (layerId === 'allLayers') {
          // let tmp1 = true// 所有都可见
          // let tmp2 = true// 所有都不可见
          console.log(this.layers)
          let visibleCount = 0
          let count = 0
          for (let index in this.layers) {
            if (this.layers[index].getVisible()) { visibleCount++ }
            count++
          }
          if (visibleCount === count) {
            this.updateLayerVisibility(layerId, false)
          } else {
            this.updateLayerVisibility(layerId, true)
          }
        } else {
          let layer = this.layers[layerId]
          let state = layer.getVisible()
          state = !state
          this.updateLayerVisibility(layerId, state)
        }
      },
      updateLayerVisibility (layerId, state) {
        switch (layerId) {
          case 'allLayers':
            let children = this.treeItems[0].children
            for (let i = 0; i < children.length; i++) { this.setLayerVisibility(children[i].layerId, state) }
            break
          default:
            this.setLayerVisibility(layerId, state)
            break
        }
      },
      addPositionListener () {
        LocationWatch(this.map)
      },
      myLocation () {
        CenterAt()
      },
      goLayer(cate) {
//        that.$http({
//              method:'get',
//              url:this.HOST+'/serviceurl/getbytheme/'+"造林绿化"
//            }).then(function (response) {
//              if(response.data.success){
//                mapLayer= response.data.data
//                that.$alert(mapLayer)
//              }
//              else {
//                that.$alert('获取错误','提示')
//              }
//            }).catch((error)=>{
//              that.$alert('获取错误','提示')
//              console.log(error)
//            })
        for (let index in this.layers) {
          if (this.layers[index].getVisible()) {
            this.layers[index].setVisible(false)
          }
        }

        let mapLayer=[{'type': 1, 'name': '彩色版', 'url': 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer', index: 4},
            {'type': 1, 'name': '暖色版', 'url': 'http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer', index: 5},
            {'type': 1, 'name': '灰色版', 'url': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer', index: 6},
            {'type': 1, 'name': '蓝黑版', 'url': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', index: 7},
          {'type': 1, 'name': '英文版', 'url': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineCommunityENG/MapServer', index: 8},
          {'type': 1, 'name': '蓝黑版', 'url': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', index: 9},
          {'type': 1, 'name': '地铁线', 'url': 'http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/subway/MapServer', index: 10},
          {'type': 1, 'name': '水系图', 'url': 'http://thematic.geoq.cn/arcgis/rest/services/ThematicMaps/WorldHydroMap/MapServer', index: 11},
          {'type': 1, 'name': '灰色版', 'url': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetGray/MapServer', index: 12},
          {'type': 1, 'name': '蓝黑版', 'url': 'http://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer', index: 13},
          ]


          let layer = mapLayer[cate]
          let tileLayer
          let name = layer.name
          let url = layer.url
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
            let key = cate.toString()
            tileLayer.setZIndex(layer.index)
            this.layers[key] = tileLayer
            this.map.addLayer(tileLayer)
          }
        this.$emit('mapView', this.map)
        }
    },
    mounted: function () {
      // this.initLayerIndex()
      that=this
      this.init()
      this.addPositionListener()
    }
  }
</script>

<style scoped lang="stylus">
  #myLoc
    position: absolute;
    z-index: 2;
    bottom: 50px;
    left: 8px;
    visibility hidden
  #myLoc img
    width: 35px;
    .thematic-container {
      margin: 0px;
      overflow: hidden;
      bottom: 0px;
      right: 0px;
      width: 100%;
      padding-top: 50px;
    }

  .theme-box {
    margin 3px 2px;
    -webkit-box-shadow: 0px 1px 1px #c8c8c8;
    -moz-box-shadow: 0px 1px 1px #c8c8c8;
    box-shadow: 0px 1px 1px #c8c8c8;
    cursor pointer
    height 2rem
    text-align: center;
  }

  .theme-title {
    font-size 0.8rem
    color #fff;
    height 2rem
    white-space nowrap
    padding-top 0.6rem
    width 100%
  }

  #thematicBox{
    position absolute
    top 60px
    left 50px
    z-index 999
    right 0px
  }
  @media screen and (min-width: 1024 px)
    #mapDiv
      width: 100%
      height: 100%;
      padding: 50px 0px 0px 0px;
      position: absolute;
    #layer-switch {
      position: absolute;
      z-index: 2;
      bottom: 2px;
      left: 10px;
    }
    #layer-switch img {
      width: 30px;
      background-size 100% 100%
      background-position center
    }
    #layerTree-container {
      position: absolute;
      bottom: 40px;
      left: 10px;
      width: 240px;
      z-index: 2;
      overflow: auto;
    }
  @media screen and (max-width: 1024px)
    #mapDiv
      width: 100%
      height: 100%;
      padding: 50px 0px 0px 0px;
      position: absolute;
    #layer-switch {
      position: absolute;
      z-index: 2;
      bottom: 2px;
      left: 10px;
    }
    #layer-switch img {
      width: 30px;
      background-size 100% 100%
      background-position center
    }
    #layerTree-container {
      position: absolute;
      bottom: 40px;
      left: 10px;
      width: 240px;
      z-index: 2;
      overflow: auto;
    }
  @media screen and (max-width: 800px){
    #myLoc{
      visibility visible
    }
  }
</style>
