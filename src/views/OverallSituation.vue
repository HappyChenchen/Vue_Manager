<template>
  <div class="home-container">
    <div>
      <div class="overallintroduce" style="padding: 10px">
        <p style="color: #000;font-weight: 600;font-size: 1.1rem;padding-bottom: 5px">【总体目标】</p>
        <span class="introduceGoal">1. 蓝绿空间：</span><span class="introducePer">70%（远景目标80%）</span><br>
        <span class="introduceGoal">2. 一级管控区森林覆盖率：</span><span class="introducePer">30%</span><br>
        <span class="introduceGoal">3. 地表水质标准：</span><span class="introducePer">地表水主要指标达到Ⅳ类，局部达到Ⅲ类</span><br>
        <span class="introduceGoal">4. 生态和农业用水量：</span><span class="introducePer">3.21亿吨</span><br>
        <span class="introduceGoal">5. 生活垃圾处理率达到：</span><span class="introducePer">100%</span><br>
        <span class="introduceGoal">6. 常住人口目标规模：</span><span class="introducePer">160万人</span>
      </div>
      <div class="pieCharts" style="padding: 5px">
        <div id="pieCharts" style="width: 100%;height: 300px;">
        </div>
      </div>
    </div>
    <div>
      <div class="barCharts" style="padding: 5px">
        <div id="barCharts" style="width: 100%;height: 300px;">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  import {macarons} from '../utils/macarons'
  export default {
    name: 'overallCharts',
    data() {
      return {
        pie_option: {
          title: {
            text: '十大工程总体进度',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            x:'center',
            top:'75%',
            data: ['造林绿化', '高标准农田建设','水生态环境治理','人居环境整治与乡村振兴','旅游发展',
              '道路交通建设', '生态基础设施建设','拆迁与生态修复','污染治理','综合监管']
          },
          toolbox: {
            show: true,
            feature: {
              mark: {show: false},
              dataView: {show: false, readOnly: false},
              magicType: {
                show: false,
                type: ['pie', 'funnel']
              },
              restore: {show: false},
              saveAsImage: {show: false}
            }
          },
          calculable: true,
          series: [
            {
              name: '十大工程总体进度',
              type: 'pie',
              radius: [20, 90],
              center:['50%', '45%'],
              roseType: 'radius',
              label: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              lableLine: {
                normal: {
                  show: false
                },
                emphasis: {
                  show: true
                }
              },
              data: [
                {value: 45, name: '造林绿化'},
                {value: 10, name: '高标准农田建设'},
                {value: 25, name: '水生态环境治理'},
                {value: 35, name: '人居环境整治与乡村振兴'},
                {value: 15, name: '旅游发展'},
                {value: 25, name: '道路交通建设'},
                {value: 30, name: '生态基础设施建设'},
                {value: 40, name: '拆迁与生态修复'},
                {value: 15, name: '污染治理'},
                {value: 25, name: '综合监管'},
              ]
            },
          ]
        },
        bar_option: {
          title: {
            text: '十大工程各区县进度',
            x: 'center'
          },
        tooltip : {
          trigger: 'axis',
          axisPointer : {            // 坐标轴指示器，坐标轴触发有效
            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        legend: {
          x:'center',
          top:'75%',
          data: ['造林绿化', '高标准农田建设','水生态环境治理','人居环境整治与乡村振兴','旅游发展',
            '道路交通建设', '生态基础设施建设','拆迁与生态修复','污染治理','综合监管']
        },
        grid: {
          left: '0%',
          right: '4%',
          bottom: '30%',
          top:'15%',
          containLabel: true
        },
        xAxis:  {
          type: 'value'
        },
        yAxis: {
          type: 'category',
          data: ['西青','滨海新区','东丽','津南','宁河']
        },
        series: [
          {
            name: '造林绿化',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '高标准农田建设',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '水生态环境治理',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '人居环境整治与乡村振兴',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '旅游发展',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '道路交通建设',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '生态基础设施建设',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '拆迁与生态修复',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '污染治理',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
          {
            name: '综合监管',
            type: 'bar',
            stack: '总量',
            label: {
              normal: {
                show: true,
                position: 'insideRight'
              }
            },
            data: [48, 50, 45, 40, 50]
          },
        ]
      },
      }
    },
    mounted() {
      this.initPieCharts()
    },
    methods: {
      initPieCharts () {
        let myPieChart = echarts.init(document.getElementById('pieCharts'),'macarons');
        // 绘制图表，this.echarts1_option是数据
        myPieChart.setOption(this.pie_option)

        let myBarChart = echarts.init(document.getElementById('barCharts'),'macarons');
        // 绘制图表，this.echarts1_option是数据
        myBarChart.setOption(this.bar_option)


        window.onresize = function(){
          myPieChart.resize();
          myBarChart.resize();
          //myChart1.resize();    //若有多个图表变动，可多写
        }
      }
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
  .overallintroduce,.pieCharts,.barCharts{
    background-color #ffffff
    -webkit-box-shadow:0px 3px 3px #c8c8c8 ;
    -moz-box-shadow:0px 3px 3px #c8c8c8 ;
    box-shadow:0px 3px 3px #c8c8c8 ;
    margin-bottom 10px
  }
  .introduceGoal{
    font-size 1rem;
    line-height 1.4rem;
    padding-left 5px;
    color #CD2626
    font-weight 600
  }
  .introducePer{
    font-size 1rem;
    line-height 1.4rem;
    padding-left 5px;
    color #000
    font-weight 600
  }
</style>
