<template>
   <div class="main-div">
     <input id="swipe" type="range" style="width: 100%;margin: 0px">
     <div class="btn-group group1" ref="group1">
       <el-select v-model="leftIndex" placeholder="请选择专题图层" @change="chooseLayer(1)" style="border: 1px solid darkgreen !important;border-radius: 5px;margin: 0px">
         <el-option
           v-for="(item,index) in leftLayers"
           :key="item.id"
           :label="item.name"
           :value="index">
         </el-option>
       </el-select>
     </div>
     <div class="btn-group group2" ref="group2">
       <el-select v-model="rightIndex" placeholder="请选择专题图层" @change="chooseLayer(2)" style="border: 1px solid darkgreen !important;border-radius: 5px;margin: 0px">
         <el-option
           v-for="(item,index) in rightLayers"
           :key="item.id"
           :label="item.name"
           :value="index">
         </el-option>
       </el-select>
     </div>
     <div id="map" class="map"></div>
   </div>
</template>

<script>
import 'ol/ol.css'
import Map from 'ol/Map.js'
import View from 'ol/View.js'
import TileLayer from 'ol/layer/Tile.js'
import {XYZ, TileArcGISRest} from 'ol/source'
var that = null
var swipe = null
export default {
  name: 'RSCompare1',
  data () {
    return {
      map: null,
      tiandituKey: '60f62b68fd6bbe652ae59aeec34c78f0',
      changeLayer: null,
      leftIndex: '',
      rightIndex: '',
      leftLayers: [],
      rightLayers: [],
      lastLeftIndex: 0,
      lastRightIndex: 1
    }
  },
  methods: {
    init () {
      this.map = new Map({
        target: 'map',
        view: new View({
          center: [106.63, 26.65],
          projection: 'EPSG:4326',
          zoom: 7
        })
      })
      let response = {
        "data":[
          {
            "baseLayer": {"displayOrder":1,"id":12,"isDisplayed":1,"name":"天地图影像地图服务","type":0,"url":"http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}","year":2012},
            "baseLayerId":12,
            "coverLayer":{"displayOrder":5,"id":32,"isDisplayed":1,"name":"gz_city","type":1,"url":"http://192.168.1.204:6080/arcgis/rest/services/gz/city/MapServer","year":2016},
            "coverLayerId":32,
            "id":5,
            "name":"影像_city"
          },
          {
            "baseLayer":{"displayOrder":1,"id":12,"isDisplayed":1,"name":"天地图影像地图服务","type":0,"url":"http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}","year":2012},
            "baseLayerId":12,
            "coverLayer":{"displayOrder":6,"id":33,"isDisplayed":1,"name":"gz_SeMap","type":1,"url":"http://192.168.1.204:6080/arcgis/rest/services/gz/SeMap/MapServer","year":2017},
            "coverLayerId":33,
            "id":6,
            "name":"影像_seMap"
          },
          {
            "baseLayer":{"displayOrder":3,"id":14,"isDisplayed":1,"name":"天地图矢量地图服务","type":0,"url":"http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}","year":2014},
            "baseLayerId":14,
            "coverLayer":{"displayOrder":5,"id":32,"isDisplayed":1,"name":"gz_city","type":1,"url":"http://192.168.1.204:6080/arcgis/rest/services/gz/city/MapServer","year":2016},
            "coverLayerId":32,
            "id":7,
            "name":"矢量_city"
          },
          {
            "baseLayer":{"displayOrder":3,"id":14,"isDisplayed":1,"name":"天地图矢量地图服务","type":0,"url":"http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}","year":2014},
            "baseLayerId":14,
            "coverLayer":{"displayOrder":6,"id":33,"isDisplayed":1,"name":"gz_SeMap","type":1,"url":"http://192.168.1.204:6080/arcgis/rest/services/gz/SeMap/MapServer","year":2017},
            "coverLayerId":33,
            "id":8,
            "name":"矢量_seMap"
          }],"message":"查询成功","status":200,"success":true}
      this.leftLayers = response.data
      this.rightLayers = response.data
      this.leftIndex = 0
      this.rightIndex = 1
      this.chooseLayer(1)
      that.map.render()
      // this.$store.dispatch('HistoryCmpMap').then((response) => {
      //
      // })
      swipe = document.getElementById('swipe')
      swipe.addEventListener('input', function () {
        that.map.render()
      }, false)
      /* var osm = new TileLayer({
        source: new OSM()
      })
      let url = 'http://192.168.1.204:6080/arcgis/rest/services/gz/city/MapServer'
      var layer = new TileLayer({
        source: new TileArcGISRest({
          url: url
        })
      })
      let url1 = 'http://192.168.1.204:6080/arcgis/rest/services/gz/county/MapServer'
      var layer1 = new TileLayer({
        source: new TileArcGISRest({
          url: url1
        })
      })

      var map = new Map({
        layers: [osm, layer1, layer],
        target: 'map',
        view: new View({
          center: [106.63, 26.65],
          projection: 'EPSG:4326',
          zoom: 7
        })
      })
      this.map = map
      var swipe = document.getElementById('swipe')

      layer.on('precompose', function (event) {
        var ctx = event.context
        var width = ctx.canvas.width * (swipe.value / 100)
        ctx.save()
        ctx.beginPath()
        ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height)
        ctx.clip()
      })

      layer.on('postcompose', function (event) {
        var ctx = event.context
        ctx.restore()
      })

      swipe.addEventListener('input', function () {
        map.render()
      }, false) */
    },
    chooseLayer (key) {
      switch (key) {
        case 1:
          // left
          this.removeLayers(this.lastLeftIndex, 1)
          this.lastLeftIndex = this.leftIndex
          let baseLayer = this.leftLayers[this.leftIndex].baseLayer
          let coverLayer = this.leftLayers[this.leftIndex].coverLayer
          let tileLayer
          switch (baseLayer.type) {
            case 0: // 天地图
              tileLayer = new TileLayer({
                title: baseLayer.name,
                key: 'left' + baseLayer.id,
                source: new XYZ({
                  crossOrigin: 'anonymous',
                  url: baseLayer.url + '&tk=' + this.tiandituKey
                })
              })
              break
            case 1:
              tileLayer = new TileLayer({
                title: baseLayer.name,
                key: 'left' + baseLayer.id,
                source: new TileArcGISRest({
                  crossOrigin: 'anonymous',
                  url: baseLayer.url
                })
              })
              break
          }
          if (tileLayer) {
            this.map.addLayer(tileLayer)
          }
          switch (coverLayer.type) {
            case 0: // 天地图
              tileLayer = new TileLayer({
                title: coverLayer.name,
                key: 'left' + coverLayer.id,
                source: new XYZ({
                  crossOrigin: 'anonymous',
                  url: coverLayer.url + '&tk=' + this.tiandituKey
                })
              })
              break
            case 1:
              tileLayer = new TileLayer({
                title: coverLayer.name,
                key: 'left' + coverLayer.id,
                source: new TileArcGISRest({
                  crossOrigin: 'anonymous',
                  url: coverLayer.url
                })
              })
              break
          }
          if (tileLayer) {
            this.map.addLayer(tileLayer)
          }
          this.chooseLayer(2)
          break
        case 2:
          this.removeLayers(this.lastRightIndex, 2)
          this.lastRightIndex = this.rightIndex
          let baseRLayer = this.rightLayers[this.rightIndex].baseLayer
          let coverRLayer = this.rightLayers[this.rightIndex].coverLayer
          let tileBRLayer, tileCRLayer
          switch (baseRLayer.type) {
            case 0: // 天地图
              tileBRLayer = new TileLayer({
                title: baseRLayer.name,
                key: 'right' + baseRLayer.id,
                source: new XYZ({
                  crossOrigin: 'anonymous',
                  url: baseRLayer.url + '&tk=' + this.tiandituKey
                })
              })
              break
            case 1:
              tileBRLayer = new TileLayer({
                title: baseRLayer.name,
                key: 'right' + baseRLayer.id,
                source: new TileArcGISRest({
                  crossOrigin: 'anonymous',
                  url: baseRLayer.url
                })
              })
              break
          }
          if (tileBRLayer) {
            this.map.addLayer(tileBRLayer)
          }
          switch (coverRLayer.type) {
            case 0: // 天地图
              tileCRLayer = new TileLayer({
                title: coverRLayer.name,
                key: 'right' + coverRLayer.id,
                source: new XYZ({
                  crossOrigin: 'anonymous',
                  url: coverRLayer.url + '&tk=' + this.tiandituKey
                })
              })
              break
            case 1:
              tileCRLayer = new TileLayer({
                title: coverRLayer.name,
                key: 'right' + coverRLayer.id,
                source: new TileArcGISRest({
                  crossOrigin: 'anonymous',
                  url: coverRLayer.url
                })
              })
              break
          }
          if (tileCRLayer) {
            this.map.addLayer(tileCRLayer)
          }
          tileCRLayer.on('precompose', function (event) {
            var ctx = event.context
            var width = ctx.canvas.width * (swipe.value / 100)
            ctx.save()
            ctx.beginPath()
            ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height)
            ctx.clip()
          })

          tileCRLayer.on('postcompose', function (event) {
            var ctx = event.context
            ctx.restore()
          })
          tileBRLayer.on('precompose', function (event) {
            var ctx = event.context
            var width = ctx.canvas.width * (swipe.value / 100)
            ctx.save()
            ctx.beginPath()
            ctx.rect(width, 0, ctx.canvas.width - width, ctx.canvas.height)
            ctx.clip()
          })

          tileBRLayer.on('postcompose', function (event) {
            var ctx = event.context
            ctx.restore()
          })
          break
      }
    },
    removeLayers (key, type) {
      let layers
      switch (type) {
        case 1:
          layers = this.leftLayers[key]
          this.map.removeLayer(this.getLayerById('left' + layers.baseLayer.id))
          this.map.removeLayer(this.getLayerById('left' + layers.coverLayer.id))
          break

        case 2:
          layers = this.rightLayers[key]
          this.map.removeLayer(this.getLayerById('right' + layers.baseLayer.id))
          this.map.removeLayer(this.getLayerById('right' + layers.coverLayer.id))
          break
      }
    },
    removeAllLayers () {
      this.map.getLayers().forEach(layer => {
        this.map.removeLayer(layer)
      })
    },
    getLayerById (id) {
      let glayer = null
      this.map.getLayers().forEach(layer => {
        if (layer.get('key') === id) {
          glayer = layer
        }
      })
      return glayer
    }
  },
  mounted () {
    that = this
    this.init()
  }
}
</script>

<style scoped lang="stylus">
  .main-div
    /*position absolute*/
    /*top 70px*/
    /*left 0px*/
    /*right 0px*/
    /*bottom 0px*/
    width: 100%;
    position: absolute;
    top: 55px;
    bottom: 0px;
  #map
    width: 100%;
    top: 10px;
    bottom: 0px;
    position: absolute;
  .btn-group {
    padding-top: 5px;
    width: 130px;
    position: absolute;
    z-index: 2;
    top:25px
  }
  .group1 {
    left: 50px !important;
  }
  .group2 {
    right: 50px !important;
  }
  #swipe{
    width: 100%;
    position: relative;
    top: 2px;
    left: 0px;
    z-index: 2;
  }
  @media screen and (min-width:  768 px) and (max-width: 1200px)
    .main-div
      width: 100%;
      position: absolute;
      top: 55px;
      bottom: 0px;
  @media screen and (min-width: 480 px) and (max-width: 768px)
    .main-div
      width: 100%;
      position: absolute;
      top: 55px;
      bottom: 0px;
  @media screen and (max-width: 480px)
    .main-div
      width: 100%;
      position: absolute;
      top: 55px;
      bottom: 0px;
    .group1
      left: 50px !important;
    .group2
      right: 10px !important;
</style>
