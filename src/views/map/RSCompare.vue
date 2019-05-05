<template>
  <el-container>
    <div class="maindiv">
      <div class="box" ref="box">
        <div class="left" ref="leftDiv" @mousemove="leftmapMouseMove">
          <div class="map-container" id="leftmap" style="height:100%">
            <img
              src="../../../static/img/mousearrow.png"
              alt=""
              ref="arrow1"
              style="position:absolute;width:15px;height:15px;z-index:1000;visibility: hidden;"/>
            <div class="btn-group group1" ref="group1" id = 'group1'>
              <el-select v-model="leftIndex" placeholder="请选择专题图层" @change="chooseLayer(1)"  :class="leftType===1?'select-vec-layer':'select-img-layer'" style="border: 1px solid darkgreen !important;border-radius: 5px;margin: 0px">
                <el-option
                  v-for="(item,index) in leftLayers"
                  :key="item.id"
                  :label="item.name"
                  :value="index">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="right" ref="rightDiv" @mousemove="rightmapMouseMove">
          <div class="map-container" id="rightmap" style="height:100%">
            <img
              src="../../../static/img/mousearrow.png"
              alt=""
              ref="arrow2"
              style="position:absolute;width:15px;height:15px;z-index:1000;visibility: hidden;"/>
            <div class="btn-group group2" ref="group2" id = 'group2'>
              <el-select v-model="rightIndex" placeholder="请选择图层" @change="chooseLayer(2)" :class="rightType===1?'select-vec-layer':'select-img-layer'" style="border: 1px solid #2D7E4C;border-radius: 5px">
                <el-option
                  v-for="(item,index) in rightLayers"
                  :key="item.id"
                  :label="item.name"
                  :value="index">
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
      </div>
      <!--<el-button-->
      <!--@click="backHome"-->
      <!--style="background: #2D7E4C;color: white;width: 95px;margin: 0px;position: absolute;right: 15px;bottom: 25px;padding:0px;height:35px"-->
      <!--icon="iconfont icon-fanhui">-->
      <!--&nbsp;返回首页-->
      <!--</el-button>-->
    </div>
  </el-container>
</template>

<script>
  import 'ol/ol.css'
  import {Map, View} from 'ol'
  import TileLayer from 'ol/layer/Tile'
  import {TileArcGISRest} from 'ol/source'
  import XYZ from 'ol/source/XYZ'
  var mapOperation1 = null
  var mapOperation2 = null
  var that = null
  export default {
    name: 'RSCompare',
    data () {
      return {
        map: null,
        map1: null,
        mapObj: null,
        startX: 0,
        endX: 0,
        moveLen: 0,
        whichdown: 0,
        whichdown1: 0,
        leftWidth: '',
        rightWidth: '',
        tiandituKey: '60f62b68fd6bbe652ae59aeec34c78f0',
        leftIndex: '',
        rightIndex: '',
        leftLayers: [],
        rightLayers: [],
        lastLeftIndex: 0,
        lastRightIndex: 1,
        rightType: 2, // 影像为2
        leftType: 1// 矢量为1
      }
    },
    methods: {
      // 初始化地图图层
      init () {
        // 左侧地图
        this.map = new Map({
          target: 'leftmap',
          view: new View({
            center: [106.63, 26.65],
            projection: 'EPSG:4326',
            zoom: 8
          })
        })
        // 右侧地图
        this.map1 = new Map({
          target: 'rightmap',
          view: new View({
            center: [106.63, 26.65],
            projection: 'EPSG:4326',
            zoom: 8
          })
        })
        this.map.on('movestart', function () {
          that.whichdown = 1
        })
        this.map.on('pointermove', function () {
          if (that.whichdown === 2) {
            return
          }
          /* that.map.on('moveend', function () {
            that.map1.setExtent(that.map.extent)
            that.whichdown = 0
          }) */

          mapOperation1 = that.map.on('moveend', function () {
            if (that.whichdown === 0) {
              return
            }
            // 将右图设置和左图同样的显示范围
            that.map1.getView().setCenter(that.map.getView().getCenter())
            that.map1.getView().setZoom(that.map.getView().getZoom())
            that.whichdown = 0
            if (mapOperation2 != null) {
              that.map1.un('moveend', function () {

              })
              mapOperation2 = null
            }
          })
        })
        this.map1.on('movestart', function () {
          that.whichdown = 2
        })
        this.map1.on('pointermove', function () {
          if (that.whichdown === 1) {
            return
          }
          /* that.map1.on('zoom-end', function () {
              that.map.setExtent(that.map1.extent)
              that.whichdown = 0
            }) */

          mapOperation2 = that.map1.on('moveend', function () {
            if (that.whichdown === 0) {
              return
            }
            // 将左图设置和右图同样的显示范围
            that.map.getView().setCenter(that.map1.getView().getCenter())
            that.map.getView().setZoom(that.map1.getView().getZoom())
            that.whichdown = 0
            if (mapOperation1 != null) {
              // mapOperation1.remove()
              that.map.un('moveend', function () {

              })
              // unByKey(mapOperation1)
              mapOperation1 = null
            }
          })
        })
        window.onresize = function(){
          that.map.render()
          that.map1.render()
        }
      },
      // 初始化图层数据
      initData () {
        /* this.leftLayers = [{layerid: 'YM', name: '玉米'}, {
          layerid: 'XM',
          name: '小麦'
        }, {layerid: 'MHT', name: '猕猴桃'}]
        this.rightLayers = [{layerid: 'YM', name: '玉米'}, {
          layerid: 'XM',
          name: '小麦'
        }, {layerid: 'MHT', name: '猕猴桃'}]
        this.leftLayer = this.leftLayers[0].name
        this.rightLayer = this.rightLayers[1].name */
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
        this.leftIndex = 1
        this.rightIndex = 3
        this.chooseLayer(1)
        this.chooseLayer(2)
      },
      // 地图左侧鼠标平移
      leftmapMouseMove (e) {
        // console.log('enterleft')
        if (that === null) { return }
        let name = e.toElement.tagName
        that.$refs.arrow1.style.visibility = 'hidden'
        that.$refs.arrow2.style.visibility = 'visible'

        if (name === 'CANVAS') {
          that.$refs.arrow2.style.top = e.offsetY + 'px'
          that.$refs.arrow2.style.left = e.offsetX + 'px'
        }
        // if (name === 'INPUT') {
        //   that.$refs.arrow2.style.top = (e.offsetY + document.getElementById('group2').offsetTop) + 'px'
        //   that.$refs.arrow2.style.left = (e.offsetX + document.getElementById('group2').offsetLeft) + 'px'
        // }else if (name === 'BUTTON' || name === 'DIV') {
        //   that.$refs.arrow2.style.top = (e.offsetY + e.target.offsetTop) + 'px'
        //   that.$refs.arrow2.style.left = (e.offsetX + e.target.offsetLeft) + 'px'
        // } else {
        //   that.$refs.arrow2.style.top = e.offsetY + 'px'
        //   that.$refs.arrow2.style.left = e.offsetX + 'px'
        // }
      },
      // 地图右侧鼠标平移
      rightmapMouseMove (e) {
        if (that === null) { return }
        // console.log('enterright')
        let name = e.toElement.tagName
        that.$refs.arrow2.style.visibility = 'hidden'
        that.$refs.arrow1.style.visibility = 'visible'


        if (name === 'CANVAS') {
          that.$refs.arrow1.style.top = e.offsetY + 'px'
          that.$refs.arrow1.style.left = e.offsetX + 'px'
        }

        // if ( name === 'INPUT') {
        //   that.$refs.arrow1.style.top = (e.offsetY + document.getElementById('group1').offsetTop) + 'px'
        //   that.$refs.arrow1.style.left = (e.offsetX + document.getElementById('group1').offsetLeft) + 'px'
        // }else if (name === 'BUTTON' || name === 'DIV') {
        //   that.$refs.arrow1.style.top = (e.offsetY + e.target.offsetTop) + 'px'
        //   that.$refs.arrow1.style.left = (e.offsetX + e.target.offsetLeft) + 'px'
        // } else {
        //   that.$refs.arrow1.style.top = e.offsetY + 'px'
        //   that.$refs.arrow1.style.left = e.offsetX + 'px'
        // }
      },
      // 选择专题图层
      chooseLayer (key) {
        switch (key) {
          case 1:
            // left
            this.removeLayers(this.map)
            this.lastLeftIndex = this.leftIndex
            let baseLayer = this.leftLayers[this.leftIndex].baseLayer
            let baseLayerName = baseLayer.name
            if (baseLayerName.indexOf('影像') != -1) {
              that.leftType = 2
            } else {
              that.leftType = 1
            }
            let coverLayer = this.leftLayers[this.leftIndex].coverLayer
            let tileLayer
            switch (baseLayer.type) {
              case 0: // 天地图
                tileLayer = new TileLayer({
                  title: baseLayer.name,
                  key: baseLayer.id,
                  source: new XYZ({
                    crossOrigin: 'anonymous',
                    url: baseLayer.url + '&tk=' + this.tiandituKey
                  })
                })
                break
              case 1:
                tileLayer = new TileLayer({
                  title: baseLayer.name,
                  key: baseLayer.id,
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
                  key: coverLayer.id,
                  source: new XYZ({
                    crossOrigin: 'anonymous',
                    url: coverLayer.url + '&tk=' + this.tiandituKey
                  })
                })
                break
              case 1:
                tileLayer = new TileLayer({
                  title: coverLayer.name,
                  key: coverLayer.id,
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
            break
          case 2:
            this.removeLayers(this.map1)
            this.lastRightIndex = this.rightIndex
            let baseRLayer = this.rightLayers[this.rightIndex].baseLayer
            let baseRLayerName = baseRLayer.name
            if (baseRLayerName.indexOf('影像') != -1) {
              that.rightType = 2
            } else {
              that.rightType = 1
            }
            let coverRLayer = this.rightLayers[this.rightIndex].coverLayer
            let tileBRLayer, tileCRLayer
            switch (baseRLayer.type) {
              case 0: // 天地图
                tileBRLayer = new TileLayer({
                  title: baseRLayer.name,
                  key: baseRLayer.id,
                  source: new XYZ({
                    crossOrigin: 'anonymous',
                    url: baseRLayer.url + '&tk=' + this.tiandituKey
                  })
                })
                break
              case 1:
                tileBRLayer = new TileLayer({
                  title: baseRLayer.name,
                  key: baseRLayer.id,
                  source: new TileArcGISRest({
                    crossOrigin: 'anonymous',
                    url: baseRLayer.url
                  })
                })
                break
            }
            if (tileBRLayer) {
              this.map1.addLayer(tileBRLayer)
            }
            switch (coverRLayer.type) {
              case 0: // 天地图
                tileCRLayer = new TileLayer({
                  title: coverRLayer.name,
                  key: coverRLayer.id,
                  source: new XYZ({
                    crossOrigin: 'anonymous',
                    url: coverRLayer.url + '&tk=' + this.tiandituKey
                  })
                })
                break
              case 1:
                tileCRLayer = new TileLayer({
                  title: coverRLayer.name,
                  key: coverRLayer.id,
                  source: new TileArcGISRest({
                    crossOrigin: 'anonymous',
                    url: coverRLayer.url
                  })
                })
                break
            }
            if (tileCRLayer) {
              this.map1.addLayer(tileCRLayer)
            }
            break
        }
      },
      getLayerById (map, id) {
        map.getLayers().forEach((layer, i) => {
          if (layer.get('key') === id) {
            return layer
          }
        })
      },
      removeLayers (map) {
        map.getLayers().forEach(layer => {
          map.removeLayer(layer)
        })
      }
      // ,
      // // 返回首页
      // backHome () {
      //   this.$router.push('/')
      // }
    },
    mounted: function () {
      that = this
      this.leftWidth = this.$refs.box.clientWidth * 0.5 - 5 + 'px'
      this.rightWidth = this.$refs.box.clientWidth * 0.5 + 'px'
      this.$refs.group1.style.left = this.$refs.leftDiv.offsetLeft + this.$refs.leftDiv.offsetWidth + 'px'
      this.$refs.group2.style.left = this.$refs.rightDiv.offsetLeft + this.$refs.rightDiv.offsetWidth - 5 + 'px'
      this.init()
      this.initData()
    }
  }
</script>

<style scoped lang="stylus">
  .maindiv {
    width: 100%;
    position: absolute;
    top: 75px;
    bottom: 0px;
  }
  .box {
    width: 100%;
    height: 100%;
    position: absolute;
    bottom 5px
  }
  .left {
    width: calc(50% - 15px);
    position: absolute;
    left: 8px;
    top: 5px;
    bottom 5px
    border: 1px solid darkgreen;
  }
  .right {
    float: left;
    width: calc(50% - 15px);
    position: absolute;
    right: 8px;
    top: 5px;
    border: 1px solid darkgreen;
    bottom 5px
  }
  .btn-group {
    padding-top: 5px;
    position: absolute;
    z-index: 2;
  }
  .group1 {
    left: 50px !important;
  }
  .group2 {
    left: 50px !important;
  }

  .select-img-layer>>>input{
    opacity: 0.7;
    background: #000000 ;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.20) ;
    border-radius: 4px ;
    color: #ffffff
  }
  .el-select-dropdown>>>.el-scrollbar__view{
    opacity: 0.7;
    background: #000000;
    box-shadow: 0 2px 6px 0 rgba(0,0,0,0.20);
    border-radius: 4px;
  }
  .el-select-dropdown__item {
    color: #09BB08 !important;
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: #F8FFEF !important;
  }
  .ol-control button {
    color: #09BB08 !important;
    background-color: #F8FFEF !important;
  }
  @media screen and (min-width:  768 px) and (max-width: 1200px)
    .maindiv {
      width: 100%;
      position: absolute;
      top: 75px;
      bottom: 0px;
    }
    .box {
      width: 100%;
      height: 100%;
      position: absolute;
      bottom 5px
    }
    .left {
      width: calc(50% - 15px);
      position: absolute;
      left: 8px;
      top: 0;
      bottom 5px
      border: 1px solid darkgreen;
    }
    .right {
      float: left;
      width: calc(50% - 15px);
      position: absolute;
      right: 8px;
      top: 0;
      border: 1px solid darkgreen;
      bottom 5px;
      margin:0;
    }
    .btn-group {
      padding-top: 5px;
      position: absolute;
      z-index: 2;
    }
    .group1 {
      left: 50px !important;
    }
    .group2 {
      left: 50px !important;
    }

  @media screen and (min-width:  480 px) and (max-width: 768px)
    .maindiv {
      width: 100%;
      position: absolute;
      top: 75px;
      bottom: 0px;
    }
    .box {
      width: 100%;
      height: 100%;
      position: absolute;
      bottom 5px
    }
    .left {
      float: left;
      height: 48%;
      width: 98%;
      position: absolute;
      top: 0;
      left 0
      right 0
      margin-left auto
      margin-right auto
      border: 1px solid darkgreen;
    }
    .right {
      float left
      position absolute
      width 98%
      bottom 0
      top 50%
      left 0
      right 0
      margin-left auto
      margin-right auto
      border: 1px solid darkgreen;
    }
    .btn-group {
      padding-top: 5px;
      position: absolute;
      z-index: 2;
    }
    .group1 {
      left: 50px !important;
    }
    .group2 {
      left: 50px !important;
    }
  @media screen and (max-width: 480px)
    .maindiv {
      width: 100%;
      position: absolute;
      top: 75px;
      bottom: 0px;
    }
    .box {
      width: 100%;
      height: 100%;
      position: absolute;
      bottom 5px
    }
    .left {
      float left
      height 48%
      width 98%
      position absolute
      top: 50%
      left 0
      right 0
      margin-left auto
      margin-right auto
      border: 1px solid darkgreen;
    }
    .right {
      float left
      position absolute
      width 98%
      bottom 0
      top 0
      left 0
      right 0
      margin-left auto
      margin-right auto
      border: 1px solid darkgreen;
    }
    .btn-group {
      padding-top: 5px;
      position: absolute;
      z-index: 2;
    }
    .group1 {
      left: 50px !important;
    }
    .group2 {
      left: 50px !important;
    }
</style>
