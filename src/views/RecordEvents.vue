<template>
  <div class="home-container">
    <section id="cd-timeline" class="cd-container">
      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-picture">
          <img src="../../static/img/record.png">
        </div><!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记1</p>
          <p>XXXXXXXXXXXXXXXXXX</p>
          <span class="cd-date">4月1日</span>
        </div> <!-- cd-timeline-content -->
      </div> <!-- cd-timeline-block -->

      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-movie">
          <img src="../../static/img/record.png">
        </div> <!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记2</p>
          <p>XXXXXXXXXXXXXXXXXX</p><span class="cd-date">3月1日</span>
        </div> <!-- cd-timeline-content -->
      </div> <!-- cd-timeline-block -->

      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-picture">
          <img src="../../static/img/record.png">
        </div> <!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记3</p>
          <p>XXXXXXXXXXXXXXXXXX</p><span class="cd-date">2月1日</span>
        </div> <!-- cd-timeline-content -->
      </div> <!-- cd-timeline-block -->

      <div class="cd-timeline-block">
        <div class="cd-timeline-img cd-location">
          <img src="../../static/img/record.png">
        </div> <!-- cd-timeline-img -->

        <div class="cd-timeline-content">
          <p class="record-title">大事记4</p>
          <p>XXXXXXXXXXXXXXXXXX</p>
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
