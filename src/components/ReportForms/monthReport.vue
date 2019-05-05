<template>
  <div id="monthReport">
    <div id="reportTitle">
      <h2 class="title">绿色生态屏障工程建设进度月报表（{{ selectedYear }}年{{ selectedMonth }}月）</h2>
    </div>
    <div id="monthTable">
      <v-table
        is-vertical-resize
        :vertical-resize-offset='60'
        is-horizontal-resize
        style="width:100%"
        :multiple-sort="false"
        :min-height="100"
        even-bg-color="#f2f2f2"
        :title-rows="tableConfig.titleRows"
        :columns="tableConfig.columns"
        :table-data="tableConfig.tableData"
        row-hover-color="#eee"
        row-click-color="#edf7ff"
        title-row-height="48"
        row-height="50"
        @sort-change="sortChange"
      ></v-table>
    </div>
    <div id="changeMonth">
      <div id="selectYearMonth">
        <span>跳转到</span>
        <el-select id="select1" v-model="selectYear" placeholder="请选择年" @change="chooseYear()">
          <el-option
            v-for="item in yearList"
            :key="item.id"
            :label="item.id"
            :value="item.id">
          </el-option>
        </el-select>
        <span>年</span>
        <el-select id="select2" v-model="selectMonth" placeholder="请选择月" @change="chooseMonth()">
          <el-option
            v-for="item in monthList"
            :key="item.id"
            :label="item.id"
            :value="item.id">
          </el-option>
        </el-select>
        <span>月</span>
        <el-button type="button" id="switch"  @click="changePage">跳转</el-button>
      </div>
      <div id="switchMonth">
        <el-button type="button" class="switchMonth" @click="lastMonth">上一月</el-button>
        <el-button type="button" class="switchMonth" @click="nextMonth">下一月</el-button>
      </div>
    </div>
  </div>
</template>

<style lang="stylus">
  @media screen and (min-width: 560px){
    #changeMonth {
      margin-top: 10px;
      height: 20%;
    }
    #selectYearMonth {
      float: left;
    }
    #switchMonth {
      float: right;
    }
    #select1{
      border: 1px solid #2D7E4C;
      border-radius: 5px;
    }
    #select2{
      border: 1px solid #2D7E4C;
      border-radius: 5px;
    }
    #switch{
      border: 1px solid #2D7E4C;
    }
  }
  @media screen and (max-width: 560px){
    #changeMonth {
      margin-top: 20px;
    }
    #switchMonth {
      margin-top: 5px  !important;
    }

    #selectYearMonth {
      margin: auto;
    }
    #select1{
      border: 1px solid #2D7E4C;
      border-radius: 5px;
    }
    #select2{
      border: 1px solid #2D7E4C;
      border-radius: 5px;
    }
    #switch{
      border: 1px solid #2D7E4C;
      margin-right: 5px;
      float: right;
      padding :0;
    }
  }
  @media screen and (min-width: 670px){
    #monthReport {
      padding-left : 10px;
      padding-right : 10px;
      padding-top: 55px;
      height: cal(100% );
      overflow hidden
      bottom 0px
      right 0px
      width 100%
    }
    #reportTitle {
      margin-top: 10px;
      margin-bottom: 20px;
    }
    #monthTable{
      height: 100%;
    }
    #changeMonth {
      height: 20%;
    }
    #selectYearMonth {
      float: left;
    }

    #switchMonth {
      float: right;
    }
    #select1{
      width:100px
    }
    #select2{
      width:60px
    }
  }
  @media screen and (min-width: 320px) and (max-width: 670px){
    #monthReport {
      padding-top: 51px;
      height: 100%;
      overflow hidden;
      bottom 0px;
      right 0px;
      width 100%
    }
    h2{
      font-size 1.2em
    }
    #reportTitle {
      margin-top: 10px;
      margin-bottom: 20px;
      margin-left: 5px;
      margin-right: 5px;
    }
    #changeMonth {
      font-size: 80%
    }
    #switchMonth {
      width: 180px;
      margin: auto;
    }
    .switchMonth{
      padding :0;
      /*font-size:14px !important;*/
      border: 1px solid #2D7E4C;
      border-radius: 5px;
      width:80px;
      height: 30px
    }
    #selectYearMonth {
      margin: auto;
    }
    #select1{
      font-size:14px !important;
      border: 1px solid #2D7E4C;
      border-radius: 5px;
      width:80px;
      height: 30px
    }
    #select2{
      font-size:14px !important;
      border: 1px solid #2D7E4C;
      border-radius: 5px;
      width:55px;
      height: 30px
    }
    #switch{
      border: 1px solid #2D7E4C;
      margin-right: 5px;
      float: right;
      padding :0;
      width:50px;
      height: 30px
    }
  }
  .title-cell-class-name-test1 {
    background-color: #2db7f5;
    color: #fff;
  }

  .title-cell-class-name-test2 {
    background-color: #f60;
    color: #fff;
  }

</style>

<script>

  import {getMonthReportList} from '@/api/reportList'
  import mock from 'mockjs'
  import 'vue-easytable/libs/themes-base/index.css'
  // 导入 table 和 分页组件
  import {VTable, VPagination} from 'vue-easytable'

  var cwidth = 150
  var cwidth1 = 60
  var myDate = new Date()
  var thisYear = myDate.getFullYear()
  var thisMonth = myDate.getMonth() + 1
  export default {
    name: "monthReport",
    components: {
      'v-table': VTable,
      'v-pagination': VPagination,
    },
    data() {
      return {
        yearList: [],
        lastMonthList: [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}, {id: 7}, {id: 8}, {id: 9}, {id: 10}, {id: 11}, {id: 12}],
        monthList: [],
        thisMonthList: [],
        selectYear: null,
        selectMonth: null,
        selectedYear: null,
        selectedMonth: null,
        tableConfig: {
          multipleSort: false,
          tableData: [],
          columns: [
            {field: 'region', width: 80, titleAlign: 'center', columnAlign: 'center', isFrozen: true},
            {field: 'JHS1', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS1', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB1', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS2', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS2', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB2', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS3', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS3', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB3', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS4', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS4', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB4', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS5', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS5', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB5', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS6', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS6', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB6', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS7', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS7', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB7', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS8', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS8', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB8', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS9', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS9', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB9', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'JHS10', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'QDS10', width: cwidth, columnAlign: 'center', isFrozen: false, isResize: true},
            {field: 'ZB10', width: cwidth1, columnAlign: 'center', isFrozen: false, isResize: true},
          ],
          titleRows: [
            [
              {fields: ['region'], title: '单位', titleAlign: 'center', rowspan: 2},
              {fields: ['JHS1', 'QDS1', 'ZB1'], title: '拆迁与生态修复', titleAlign: 'center', colspan: 3},
              {fields: ['JHS2', 'QDS2', 'ZB2'], title: '造林绿化', titleAlign: 'center', colspan: 3},
              {fields: ['JHS3', 'QDS3', 'ZB3'], title: '水生态环境治理', titleAlign: 'center', colspan: 3},
              {fields: ['JHS4', 'QDS4', 'ZB4'], title: '道路交通建设', titleAlign: 'center', colspan: 3},
              {fields: ['JHS5', 'QDS5', 'ZB5'], title: '旅游发展', titleAlign: 'center', colspan: 3},
              {fields: ['JHS6', 'QDS6', 'ZB6'], title: '高标准农田建设', titleAlign: 'center', colspan: 3},
              {fields: ['JHS7', 'QDS7', 'ZB7'], title: '基础设施建设', titleAlign: 'center', colspan: 3},
              {fields: ['JHS8', 'QDS8', 'ZB8'], title: '人居环境整治与乡村振兴', titleAlign: 'center', colspan: 3},
              {fields: ['JHS9', 'QDS9', 'ZB9'], title: '污染治理', titleAlign: 'center', colspan: 3},
              {fields: ['JHS10', 'QDS10', 'ZB10'], title: '综合监管', titleAlign: 'center', colspan: 3},
            ],
            [
              {fields: ['JHS1'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS1'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB1'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS2'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS2'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB2'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS3'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS3'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB3'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS4'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS4'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB4'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS5'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS5'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB5'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS6'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS6'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB6'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS7'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS7'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB7'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS8'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS8'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB8'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS9'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS9'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB9'], title: '占比(%)', titleAlign: 'center'},
              {fields: ['JHS10'], title: '计划数', titleAlign: 'center'},
              {fields: ['QDS10'], title: '启动数', titleAlign: 'center'},
              {fields: ['ZB10'], title: '占比(%)', titleAlign: 'center'},
            ],
          ],
        }
      }
    },
    methods: {
      initData() {
        if (thisMonth === 1) {
          thisYear -= 1
          thisMonth = 12
        }else {
          thisMonth -= 1
        }
        for (let j = 2017; j <= thisYear; j++) {
          let year = {
            id: j
          }
          this.yearList.push(year)
        }
        for (let i = 0; i < thisMonth; i++) {
          let month = {
            id : i+1
          }
          this.thisMonthList.push(month)
        }
        this.monthList = this.thisMonthList
        this.selectYear = thisYear
        this.selectMonth = thisMonth
        this.selectedYear = thisYear
        this.selectedMonth = thisMonth
      },
      getTableData(year, month) {
        getMonthReportList(year, month).then(res => {
          console.log(res)
          this.tableConfig.tableData = res.data
        })
      },
      sortChange(params) {
        if (params.height.length > 0) {
          this.tableConfig.tableData.sort(function (a, b) {
            if (params.height === 'asc') {
              return a.height - b.height;
            } else if (params.height === 'desc') {
              return b.height - a.height;
            } else {
              return 0;
            }
          });
        }
      },
      chooseYear() {
        if(this.selectYear === thisYear){
          this.monthList = this.thisMonthList
          if (this.selectMonth > thisMonth) {
            this.selectMonth = thisMonth
          }
        }else {
          this.monthList = this.lastMonthList
        }
      },
      chooseMonth() {
      },
      changePage() {
        this.selectedYear = this.selectYear
        this.selectedMonth = this.selectMonth
        this.getTableData(this.selectYear, this.selectMonth);
      },
      lastMonth() {
        if (this.selectMonth > 1) {
          this.selectMonth -= 1
          this.getTableData(this.selectYear, this.selectMonth);
        } else if (this.selectMonth === 1 && this.selectYear !== this.yearList[0].id) {
          this.selectYear -= 1
          this.selectMonth = 12
          this.getTableData(this.selectYear, this.selectMonth);
        }
        this.selectedYear = this.selectYear
        this.selectedMonth = this.selectMonth
      },
      nextMonth() {
        if (this.selectMonth < 12 && this.selectYear !== thisYear) {
          this.selectMonth += 1
          this.getTableData(this.selectYear, this.selectMonth);
        } else if (this.selectMonth === 12 && this.selectYear !== thisYear) {
          this.selectYear += 1
          this.selectMonth = 1
          this.getTableData(this.selectYear, this.selectMonth);
        } else if (this.selectMonth < thisMonth && this.selectYear === thisYear) {
          this.selectMonth += 1
          this.getTableData(this.selectYear, this.selectMonth);
        }
        this.selectedYear = this.selectYear
        this.selectedMonth = this.selectMonth
      }
    },
    created() {
      this.initData()
      this.getTableData(this.selectYear, this.selectMonth);
    },
    mounted() {
    }
  }
</script>
