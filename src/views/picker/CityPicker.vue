<template>
  <div>
    <area-cascader :level="1" v-model="selected" :data="$region"></area-cascader>
    <!--<div>{{selected}}</div>-->
  </div>
</template>

<script>
import AreaCascader from './area-cascader/cascader'
export default {
  name: 'CityPicker',
  component: { AreaCascader },
  data () {
    return {
      selected: []
    }
  },
  mounted () {
  },
  watch: {
    selected (curVal, oldVal) {
      this.$emit('selected', curVal)
    }
  }
}
</script>

<style scoped>

</style>
