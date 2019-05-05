<template>
    <Map @mapView="setMap"/>
</template>

<script>
import 'ol/ol.css'
import VectorLayer from 'ol/layer/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import VectorSource from 'ol/source/Vector'
import {Fill, Stroke, Style, Text} from 'ol/style'
import Map from './Map'
export default {
  components: { Map },
  name: 'Grading',
  props: {
    data: {
      type: Array,
      default: () => [{'name': '贵阳市', 'pac': '520100000', 'total': 59659, 'x': 106.710366, 'y': 26.85083603},
        {'name': '六盘水市', 'pac': '520200000', 'total': 39019, 'x': 104.8937499, 'y': 26.12906649},
        {'name': '遵义市', 'pac': '520300000', 'total': 98651, 'x': 107.0848868, 'y': 28.1685297},
        {'name': '安顺市', 'pac': '520400000', 'total': 28373, 'x': 105.9319564, 'y': 25.98231845},
        {'name': '毕节市', 'pac': '520500000', 'total': 64249, 'x': 105.2148075, 'y': 27.06739782},
        {'name': '铜仁市', 'pac': '520600000', 'total': 35847, 'x': 108.5412783, 'y': 27.97170862},
        {'name': '黔西南布依族苗族自治州', 'pac': '522300000', 'total': 87633, 'x': 105.464204, 'y': 25.2654989},
        {'name': '黔东南苗族侗族自治州', 'pac': '522600000', 'total': 31881, 'x': 108.5577076, 'y': 26.50564329},
        {'name': '黔南布依族苗族自治州', 'pac': '522700000', 'total': 74578, 'x': 107.2501635, 'y': 26.01293803}]
    },
    type: {
      type: Number,
      default: 1
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
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  methods: {
    setMap (value) {
      this.map = value
      this.$emit('mapView', this.map)
    },
    init () {
      // if (this.initTimer) {
      //   clearTimeout(this.initTimer)
      // }
      // let that = this
      // this.initTimer = setTimeout(function () {
      //
      // }, 300)
      let min = Math.min.apply(Math, this.data.map(function (o) {
        return o.total
      }))
      let max = Math.max.apply(Math, this.data.map(function (o) {
        return o.total
      }))
      this.minStatisticValue = this.type === 1 ? min : Math.floor(min)
      this.maxStatisticValue = this.type === 1 ? max : Math.floor(max)
      this.initRenderColors()
    },
    // 绘制
    clearCustomFeature () {
      if (this.customFeatureLayer) {
        this.map.removeLayer(this.customFeatureLayer)
        this.customFeatureLayer = null
      }
    },
    drawCustomFeature () {
      if (!this.data || this.data.length === 0 || !this.geojson || !this.geojson.type) { return }
      if (this.drawTimer) {
        clearTimeout(this.drawTimer)
      }
      this.init()
      let that = this
      this.drawTimer = setTimeout(function () {
        that.clearCustomFeature()
        that.customFeatureVectorSource = new VectorSource({
          features: (new GeoJSON()).readFeatures(that.geojson)
        })
        that.customFeatureLayer = new VectorLayer({
          source: that.customFeatureVectorSource,
          style: function (feature) {
            let city = feature.get('name')
            // var city0=feature.get("NAME");
            let statisticInfo = that.getStatisticInfoByName(city)
            // var statisticInfo=undefined;
            let total
            if (statisticInfo) {
              total = statisticInfo.total
            } else {
              total = 0
            }
            let index = that.getRenderColorIndex(total)
            let style = new Style({
              fill: new Fill({
                color: that.renderColors[index]
              }),
              text: new Text({
                text: city + '\n' + total,
                font: '16px PingFangSC-Regular',
                fill: new Fill({
                  color: '#000'
                }),
                stroke: new Stroke({
                  color: '#000',
                  width: 1
                })
              }),
              stroke: new Stroke({
                color: '#967645',
                width: 1
              })
            })
            return [style]
          }
        })
        that.map.addLayer(that.customFeatureLayer)
        let index = that.map.getSize()
        that.customFeatureLayer.setZIndex(index)
        let pac
        if (that.geojson.features[0].properties.parent != undefined) {
          pac = that.geojson.features[0].properties.parent.pac
        } else {
          pac = that.geojson.features[0].properties.pac
        }
        that.map.getView().fit(that.customFeatureVectorSource.getExtent(), {constrainResolution: false})
        /* 求解范围结束 */
        /* let extent = that.customFeatureVectorSource.getExtent()
        // let centerPoint =extent.getCenter()
        let centerPoint = [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2]
        that.Map.getView().setCenter(centerPoint)
        if (pac.toString().substring(0, 6).indexOf('0000') !== -1) {
          that.Map.getView().setZoom(7)
        } else if (pac.toString().substring(0, 6).indexOf('00') !== -1) {
          that.Map.getView().setZoom(9)
        } else {
          that.Map.getView().setZoom(11)
        } */
      }, 300)
    },
    getStatisticInfoByName (name) {
      let info
      this.data.forEach(function (item) {
        if (item.name === name) {
          info = item
        }
      })
      return info
    },
    getRenderColorIndex (statisticValue) {
      if ((this.minStatisticValue === 0 && this.maxStatisticValue === 0) || statisticValue === this.minStatisticValue) return 0
      if (this.minStatisticValue === this.maxStatisticValue || this.maxStatisticValue === statisticValue) return 4
      let interval = this.type === 1 ? (this.maxStatisticValue - this.minStatisticValue) / 5 : Math.floor((this.maxStatisticValue - this.minStatisticValue) / 5)
      return Math.ceil((statisticValue - this.minStatisticValue) / interval) - 1
    },
    initRenderColors () {
      let startColorRGBs = this.startColor.substr(this.startColor.indexOf('(') + 1)
      startColorRGBs = startColorRGBs.substr(0, startColorRGBs.indexOf(')')).split(',')
      startColorRGBs[0] = parseInt(startColorRGBs[0])
      startColorRGBs[1] = parseInt(startColorRGBs[1])
      startColorRGBs[2] = parseInt(startColorRGBs[2])
      startColorRGBs[3] = parseInt(startColorRGBs[3])
      let endColorRGBs = this.endColor.substr(this.endColor.indexOf('(') + 1)
      endColorRGBs = endColorRGBs.substr(0, endColorRGBs.indexOf(')')).split(',')
      endColorRGBs[0] = parseInt(endColorRGBs[0])
      endColorRGBs[1] = parseInt(endColorRGBs[1])
      endColorRGBs[2] = parseInt(endColorRGBs[2])
      endColorRGBs[3] = parseInt(endColorRGBs[3])

      this.renderColors = []
      this.renderColors.push(this.startColor)
      for (let i = 1; i < this.classifyLevel - 1; i++) {
        let renderColorRGBs = []
        renderColorRGBs[0] = startColorRGBs[0] + parseInt(((endColorRGBs[0] - startColorRGBs[0]) / (this.classifyLevel - 1)) * i)
        renderColorRGBs[1] = startColorRGBs[1] + parseInt(((endColorRGBs[1] - startColorRGBs[1]) / (this.classifyLevel - 1)) * i)
        renderColorRGBs[2] = startColorRGBs[2] + parseInt(((endColorRGBs[2] - startColorRGBs[2]) / (this.classifyLevel - 1)) * i)
        renderColorRGBs[3] = startColorRGBs[3] + parseInt(((endColorRGBs[3] - startColorRGBs[3]) / (this.classifyLevel - 1)) * i)
        let renderColor = 'rgba(' + renderColorRGBs[0] + ',' + renderColorRGBs[1] + ',' + renderColorRGBs[2] + ',' + renderColorRGBs[3] + ')'
        this.renderColors.push(renderColor)
      }
      this.renderColors.push(this.endColor)
    }
  },
  mounted: function () {
    // this.initLayerIndex()
    this.init()
    // this.addPositionListener()
  },
  watch: {
    data: {
      immediate: true,
      handler: function () {
        this.drawCustomFeature()
      }
    },
    geojson: {
      immediate: true,
      handler: function () {
        this.drawCustomFeature()
      }
    },
    startColor: {
      immediate: true,
      handler: function () {
        this.init()
        this.drawCustomFeature()
      }
    },
    endColor: {
      immediate: true,
      handler: function () {
        this.init()
        this.drawCustomFeature()
      }
    },
    classifyLevel: {
      immediate: true,
      handler: function () {
        this.init()
        this.drawCustomFeature()
      }
    }
  }
}
</script>

<style scoped lang="stylus">
  @media screen and (min-width: 1024px)
    #mapDiv
      width: 100%
      height: 100%;
  @media screen and (min-width: 360px) and (max-width: 1024px)
    #mapDiv
      width: 100%
      height: 100%;
</style>
