<template>
  <div class="home-container">
    <div>
      <div class="overallintroduce" style="padding: 10px">
        <p style="color: #000;font-weight: 600;font-size: 1.1rem;padding-bottom: 5px">【总体目标】</p>
        <span class="introduceGoal">1. XXXX：</span><span class="introducePer">XXXX</span><br>
        <span class="introduceGoal">2. XXXX：</span><span class="introducePer">XXXX</span><br>
        <span class="introduceGoal">3. XXXX：</span><span class="introducePer">XXXX</span><br>
        <span class="introduceGoal">4. XXXX：</span><span class="introducePer">XXXX</span><br>
        <span class="introduceGoal">5. XXXX：</span><span class="introducePer">XXXX</span><br>
        <span class="introduceGoal">6. XXXX：</span><span class="introducePer">XXXX</span>
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
            text: '标题',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
          },
          legend: {
            x:'center',
            top:'75%',
            data: ['项目A', '项目B','项目C','项目D','项目E',
              '项目F', '项目G','项目H','项目J','项目J']
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
              name: '标题',
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
                {value: 45, name: '项目A'},
                {value: 10, name: '项目B'},
                {value: 25, name: '项目C'},
                {value: 35, name: '项目D'},
                {value: 15, name: '项目E'},
                {value: 25, name: '项目F'},
                {value: 30, name: '项目G'},
                {value: 40, name: '项目H'},
                {value: 15, name: '项目I'},
                {value: 25, name: '项目J'},
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
          data: ['项目A', '项目B','项目C','项目D','项目E',
            '项目F', '项目G','项目H','项目I','项目J']
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
          data: ['地区1','地区2','地区3','地区4','地区5']
        },
        series: [
          {
            name: '项目A',
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
            name: '项目B',
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
            name: '项目C',
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
            name: '项目D',
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
            name: '项目E',
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
            name: '项目F',
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
            name: '项目G',
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
            name: '项目H',
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
            name: '项目I',
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
            name: '项目J',
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
