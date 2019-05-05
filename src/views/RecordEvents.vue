<template>
  <div class="home-container">
    <section id="cd-timeline" class="cd-container">
      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-picture">
          <img src="../../static/img/record.png">
        </div><!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记1</p>
          <p>天津市绿色生态屏障规划总面积约736平方公里，涉及宁河、东丽、津南、西青及滨海新区5个区，其中津南区面积最大，为329.96平方公里，占全市绿色生态屏障规划总面积的44.7%，占津南辖区总面积的85.1%，是我市绿色生态屏障建设的主战场。</p>
          <span class="cd-date">4月1日</span>
        </div> <!-- cd-timeline-content -->
      </div> <!-- cd-timeline-block -->

      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-movie">
          <img src="../../static/img/record.png">
        </div> <!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记2</p>
          <p>天津市绿色生态屏障规划总面积约736平方公里，涉及宁河、东丽、津南、西青及滨海新区5个区，其中津南区面积最大，为329.96平方公里，占全市绿色生态屏障规划总面积的44.7%，占津南辖区总面积的85.1%，是我市绿色生态屏障建设的主战场。</p>
          <span class="cd-date">3月1日</span>
        </div> <!-- cd-timeline-content -->
      </div> <!-- cd-timeline-block -->

      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-picture">
          <img src="../../static/img/record.png">
        </div> <!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记3</p>
          <p>天津市绿色生态屏障规划总面积约736平方公里，涉及宁河、东丽、津南、西青及滨海新区5个区，其中津南区面积最大，为329.96平方公里，占全市绿色生态屏障规划总面积的44.7%，占津南辖区总面积的85.1%，是我市绿色生态屏障建设的主战场。</p>
          <span class="cd-date">2月1日</span>
        </div> <!-- cd-timeline-content -->
      </div> <!-- cd-timeline-block -->

      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-location">
          <img src="../../static/img/record.png">
        </div> <!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记4</p>
          <p>天津市绿色生态屏障规划总面积约736平方公里，涉及宁河、东丽、津南、西青及滨海新区5个区，其中津南区面积最大，为329.96平方公里，占全市绿色生态屏障规划总面积的44.7%，占津南辖区总面积的85.1%，是我市绿色生态屏障建设的主战场。</p>
          <span class="cd-date">1月1日</span>
        </div> <!-- cd-timeline-content -->
      </div> <!-- cd-timeline-block -->
    </section> <!-- cd-timeline -->
  </div>
</template>
<script>
  import SvgIcon from "../components/SvgIcon/index.vue";

  export default {
    components: {SvgIcon},
    name: 'recordEvents',
    data() {
      return {}
    },
    mounted() {

    },
    methods: {

    },
  }
</script>

<style lang="stylus">
  .home-container {
    margin: 0px;
    overflow: hidden;
    bottom: 0px;
    right: 0px;
    width: 100%;
    padding: 70px 20px 0px 20px;
  }
  .record-title{
    font-size 1.1rem !important;
    font-weight 600
    color #000
    margin 0px !important
  }
</style>
