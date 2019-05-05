<template>
  <div class="layercontrol">
    <span style="color:#409EFF;font-weight:bold">图层管理</span>
  <el-tree
    :data="data"
    show-checkbox
    node-key="layerId"
    default-expand-all
    :default-checked-keys="['allLayers']"
    :expand-on-click-node="false"
    :render-content="renderContent"
    @check="selectChange"
    ref="tree">

  </el-tree>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'LayerTree',
  props: {
    data: {
      type: Array,
      required: true
    }
  },
  methods: {
    renderContent (h, { node, data, store }) {
      return (
        <span class = "span">
            <span><img src={data.pngPath} style="width:16px;height:16px"/> {node.label}</span>
        </span>
      )
    },
    selectChange (data) {
      this.$emit('selectChange', data.layerId)
    },
    getCheckedKeys () {
      console.log(this.$refs.layertree.getCheckedKeys())
    },
    setCheckedKeys(data) {
      this.$refs.tree.setCheckedKeys(data)
    },
  }
}
</script>

<style scoped>
  .span {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .layercontrol{
    background-color: white;
    width: 100%;
  }
</style>
