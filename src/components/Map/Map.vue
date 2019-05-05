<template>
  <div id = 'mapDiv'>
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

export default {
  name: 'Map',
  data () {
    return {
      isLayerTreeShow: false,
      layers: {},
      treeItems: [],
      tiandituKey: '60f62b68fd6bbe652ae59aeec34c78f0',
      // data: [{'type': 0, 'name': '天地图矢量地图服务', 'url': 'http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}', index: 2},
      //   {'type': 0, 'name': '天地图矢量注记服务', 'url': 'http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}', index: 3},
      //   {'type': 0, 'name': '天地图影像地图服务', 'url': 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}', index: 0},
      //   {'type': 0, 'name': '天地图影像注记服务', 'url': 'http://t0.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}', index: 1}]
      data: [{'type': 0, 'name': '天地图矢量地图服务', 'url': 'http://t3.tianditu.gov.cn/DataServer?T=vec_w&x={x}&y={y}&l={z}', index: 2},
        {'type': 0, 'name': '天地图矢量注记服务', 'url': 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}', index: 3},
        {'type': 0, 'name': '天地图影像地图服务', 'url': 'http://t3.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}', index: 0},
        {'type': 0, 'name': '天地图影像注记服务', 'url': 'http://t3.tianditu.com/DataServer?T=cia_w&x={x}&y={y}&l={z}', index: 1}],
      map: null
    }
  },
  components: { LayerTree },
  methods: {
    init () {
      this.map = new Map({
        target: 'mapDiv',
        view: new View({
          center: [106.63, 26.65],
          projection: 'EPSG:4326',
          zoom: 8
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
      // this.Map.addLayer(this.vectorLayer)
      // this.Map.addLayer(this.vectorAnnoLayer)
      // this.Map.addLayer(this.imageLayer)
      // this.Map.addLayer(this.imageAnnoLayer)
      // this.changeMap(0)
      this.$emit('mapView', this.map)
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
    //     this.vectorAnnoLayer.setVisible(true)
    //     this.imageLayer.setVisible(false)
    //     this.imageAnnoLayer.setVisible(false)
    //   } else {
    //     this.vectorLayer.setVisible(false)
    //     this.vectorAnnoLayer.setVisible(false)
    //     this.imageLayer.setVisible(true)
    //     this.imageAnnoLayer.setVisible(true)
    //   }
    // },
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
    }

  },
  mounted: function () {
    // this.initLayerIndex()
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
  @media screen and (max-width: 480px){
    #myLoc{
      visibility visible
    }
  }
</style>
