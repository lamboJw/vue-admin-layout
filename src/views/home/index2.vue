<template>
  <div class="app-container">
    <el-row class="base_info" type="flex" justify="space-between">
      <el-col :span="5">
        <el-col :span="6" style="text-align: center;">
          <el-avatar :src="admin_info.icon">
            <img src="https://h5sdk-hy.921.com/image/head-default.png" alt="">
          </el-avatar>
        </el-col>
        <el-col :span="18">
          <p style="margin: 10px 0 10px 0;"><span style="font-size: 24px;">欢迎回来，{{ admin_info.name }}</span></p>
          <p class="little"><span>帐号：</span>{{ admin_info.account }}</p>
          <p class="little"><span>上次登录IP：</span>{{ admin_info.ip }} {{ admin_info.area }}</p>
          <p class="little"><span>上次登录时间：</span>{{ admin_info.last_time }}</p>
        </el-col>
      </el-col>
      <el-col class="todo" :span="3">
        <p>提现审核：<var>{{ todo.rp_approve }}</var>个待处理</p>
        <p>兑换发货：<var>{{ todo.exchange_real }}</var>个待处理</p>
        <p>活动周边发货：<var>{{ todo.activity_related_product }}</var>个待处理</p>
      </el-col>
      <el-col class="right_col" :span="4">
        <div>
          <span>{{ year_data.active }}</span>
          <span>三月内活跃用户</span>
        </div>
      </el-col>
      <el-col class="right_col" :span="4">
        <div>
          <span>{{ year_data.pay_user }}</span>
          <span>年度累计充值用户</span>
        </div>
      </el-col>
      <el-col class="right_col" :span="4">
        <div>
          <span>{{ year_data.user }}</span>
          <span>年度累计用户</span>
        </div>
      </el-col>
      <el-col class="right_col" :span="4">
        <div>
          <span>{{ year_data.pay }}</span>
          <span>年度累计收入</span>
        </div>
      </el-col>
    </el-row>
    <el-row class="data_overview" type="flex" justify="space-between">
      <el-col class="card" :span="12">
        <el-row class="header_row">
          <el-col class="title" :span="6">
            数据概览
          </el-col>
          <el-col :span="6" :offset="12">
            <el-select v-model="overview_scope">
              <el-option value="day" label="今日" />
              <el-option value="week" label="本周" />
              <el-option value="month" label="本月" />
            </el-select>
          </el-col>
        </el-row>
        <el-row type="flex" class="overview">
          <el-col class="today" :span="8">
            <p>{{ overview_text_this }}收入</p>
            <p>{{ overview.this_pay.num }}</p>
            <p :class="ratio_class(overview.this_pay.ratio)">{{ ratio_text(overview.this_pay.ratio) }}</p>
          </el-col>
          <el-col class="today" :span="8">
            <p>{{ overview_text_this }}新增</p>
            <p>{{ overview.this_new_reg.num }}</p>
            <p :class="ratio_class(overview.this_new_reg.ratio)">{{ ratio_text(overview.this_new_reg.ratio) }}</p>
          </el-col>
          <el-col class="today" :span="8">
            <p>{{ overview_text_this }}活跃</p>
            <p>{{ overview.this_active.num }}</p>
            <p :class="ratio_class(overview.this_active.ratio)">{{ ratio_text(overview.this_active.ratio) }}</p>
          </el-col>
        </el-row>
        <el-row type="flex" class="overview">
          <el-col class="today" :span="8">
            <p>{{ overview_text_pre }}收入</p>
            <p>{{ overview.pre_pay.num }}</p>
            <p :class="ratio_class(overview.pre_pay.ratio)">{{ ratio_text(overview.pre_pay.ratio) }}</p>
          </el-col>
          <el-col class="today" :span="8">
            <p>{{ overview_text_pre }}新增</p>
            <p>{{ overview.pre_new_reg.num }}</p>
            <p :class="ratio_class(overview.pre_new_reg.ratio)">{{ ratio_text(overview.pre_new_reg.ratio) }}</p>
          </el-col>
          <el-col class="today" :span="8">
            <p>{{ overview_text_pre }}活跃</p>
            <p>{{ overview.pre_active.num }}</p>
            <p :class="ratio_class(overview.pre_active.ratio)">{{ ratio_text(overview.pre_active.ratio) }}</p>
          </el-col>
        </el-row>
      </el-col>
      <el-col class="card" :span="12">
        <el-row class="header_row" :gutter="5">
          <el-col class="title" :span="6">TOP5</el-col>
          <el-col :span="6" :offset="6">
            <el-select v-model="top5_scope">
              <el-option value="day" label="今日" />
              <el-option value="week" label="本周" />
              <el-option value="month" label="本月" />
            </el-select>
          </el-col>
          <el-col :span="6">
            <el-select v-model="top5_order">
              <el-option value="channel" label="渠道排序" />
              <el-option value="game" label="游戏排序" />
            </el-select>
          </el-col>
        </el-row>
        <el-row class="top5_btn_group">
          <el-col>
            <el-button-group>
              <el-button size="mini" :class="top5_type==='pay' ? 'active' : ''" @click="top5_btn_change('pay')">收入</el-button>
              <el-button size="mini" :class="top5_type==='newreg' ? 'active' : ''" @click="top5_btn_change('newreg')">新增用户</el-button>
              <el-button size="mini" :class="top5_type==='loginuid' ? 'active' : ''" @click="top5_btn_change('loginuid')">活跃用户</el-button>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row class="top5_table">
          <el-table :data="top5_table.data" border style="width: 100%;" :cell-style="{padding:'5px'}" :header-cell-style="{padding:'5px'}">
            <el-table-column v-for="(item) in top5_table.col" :key="item.field" :label="item.title" :min-width="item.width" show-overflow-tooltip>
              <template slot-scope="{row}">
                <el-progress v-if="item.field === 'ratio'" :text-inside="true" :stroke-width="24" :percentage="parseFloat(row.ratio.replace('%', ''))" status="success" />
                <span v-else-if="item.field === 'compare'" :class="ratio_class(row.compare)">{{ ratio_text(row.compare) }}</span>
                <span v-else>{{ row[item.field] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-col>
    </el-row>
    <el-row class="line_chart">
      <el-row class="header_row">
        <el-col class="title" :span="6">
          数据趋势
        </el-col>
        <el-col :span="6" :offset="12">
          <el-select v-model="trend_scope" style="float: right;">
            <el-option value="today" label="今天" />
            <el-option value="-6 days" label="过去7天" />
            <el-option value="-29 days" label="过去30天" />
          </el-select>
        </el-col>
      </el-row>
      <el-row v-show="trend_scope!=='today'">
        <el-col :offset="2">
          <el-select v-model="trend_compare_1">
            <el-option value="new_reg" label="新增" />
            <el-option value="active" label="活跃" />
            <el-option value="live" label="留存" />
            <el-option value="pay" label="收入" />
          </el-select>
          <div class="middle-text">对比</div>
          <el-select v-model="trend_compare_2">
            <el-option value="new_reg" label="新增" />
            <el-option value="active" label="活跃" />
            <el-option value="live" label="留存" />
            <el-option value="pay" label="收入" />
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <div id="chart" />
      </el-row>
    </el-row>
  </div>
</template>

<script>
import { getHomeInfo, getOverview, getTop5, getLineChart } from '@/api/home/index2'
import * as echarts from 'echarts'

export default {
  name: 'Index2',
  data() {
    return {
      admin_info: {
        account: '',
        area: '',
        icon: '',
        ip: '',
        last_time: '',
        name: ''
      },
      todo: {
        activity_related_product: 0,
        exchange_real: 0,
        rp_approve: 0
      },
      year_data: {
        pay: 0,
        user: 0,
        pay_user: 0,
        active: 0
      },
      overview_scope: 'day',
      top5_scope: 'day',
      top5_order: 'channel',
      top5_type: 'pay',
      overview: {
        pre_active: { num: 0, ratio: 0 },
        pre_new_reg: { num: 0, ratio: 0 },
        pre_pay: { num: 0, ratio: 0 },
        this_active: { num: 0, ratio: 0 },
        this_new_reg: { num: 0, ratio: 0 },
        this_pay: { num: 0, ratio: 0 }
      },
      top5_table: {
        col: [
          { 'field': 'id', 'title': '排序', 'width': '10%' },
          { 'field': 'channel', 'title': '渠道', 'width': '15%' },
          { 'field': 'pay', 'title': '收入', 'width': '15%' },
          { 'field': 'ratio', 'title': '全平台占比', 'width': '45%' },
          { 'field': 'compare', 'title': '环比', 'width': '15%' }
        ],
        data: []
      },
      trend_scope: 'today',
      trend_compare_1: 'new_reg',
      trend_compare_2: 'new_reg',
      line_chart: null,
      line_chart_option: {
        xAxis: {
          type: 'category',
          data: []
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: []
        },
        series: []
      }
    }
  },
  computed: {
    overview_text_this: function() {
      switch (this.overview_scope) {
        case 'day': {
          return '今日'
        }
        case 'week': {
          return '本周'
        }
        case 'month': {
          return '本月'
        }
        default: return '今日'
      }
    },
    overview_text_pre: function() {
      switch (this.overview_scope) {
        case 'day': {
          return '昨日'
        }
        case 'week': {
          return '上周'
        }
        case 'month': {
          return '上月'
        }
        default: return '昨日'
      }
    }
  },
  watch: {
    overview_scope: function() {
      this.getDataOverview()
    },
    top5_scope: function() {
      this.getTop5()
    },
    top5_type: function() {
      this.getTop5()
    },
    top5_order: function() {
      this.getTop5()
    },
    trend_scope: function() {
      this.getLineChart()
    },
    trend_compare_1: function() {
      this.getLineChart()
    },
    trend_compare_2: function() {
      this.getLineChart()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      getHomeInfo().then(result => {
        const { admin_info, todo, year_data } = result
        this.admin_info = admin_info
        this.admin_info.icon = process.env.VUE_APP_HOST + this.admin_info.icon
        this.todo = todo
        this.year_data = year_data
      }).catch(err => { console.log(err.message) })
      this.getDataOverview()
      this.getTop5()
      this.line_chart = echarts.init(document.getElementById('chart'))
      this.getLineChart()
    },
    getDataOverview() {
      getOverview({ scope: this.overview_scope }).then(result => {
        for (const i in this.overview) {
          if (typeof result[i] !== 'undefined') {
            this.overview[i] = result[i]
          }
        }
      }).catch(err => { console.log(err.message) })
    },
    ratio_class(ratio) {
      if (ratio > 0) {
        return 'up'
      } else if (ratio < 0) {
        return 'down'
      } else {
        return ''
      }
    },
    ratio_text(ratio) {
      if (ratio > 0) {
        return `⬆ ${ratio}%`
      } else if (ratio < 0) {
        return `⬇ ${ratio}%`
      } else {
        return ` ${ratio}%`
      }
    },
    top5_btn_change(type) {
      this.top5_type = type
    },
    getTop5() {
      getTop5({ scope: this.top5_scope, type: this.top5_type, order: this.top5_order }).then(result => {
        this.top5_table = result
      }).catch(err => { console.log(err.message) })
    },
    getLineChart() {
      getLineChart({ scope: this.trend_scope, compare1: this.trend_compare_1, compare2: this.trend_compare_2 }).then(result => {
        this.line_chart_option.xAxis.data = result.xAxis
        this.line_chart_option.legend.data = result.legend
        this.line_chart_option.series[0] = { data: result.series1, type: 'line', name: result.legend[0] }
        this.line_chart_option.series[1] = { data: result.series2, type: 'line', name: result.legend[1] }
        this.line_chart.setOption(this.line_chart_option)
      }).catch(err => { console.log(err.message) })
    }
  }
}
</script>

<style lang="scss" scoped>
  .app-container::v-deep {
    background-color: #F2F2F2;
    padding: 10px 0;
    .header_row {
      position: relative;
      height: 48px;
      line-height: 45px;
      padding: 0 15px;
      border-bottom: 1px solid rgb(246, 246, 246);
      color: rgb(51, 51, 51);
      border-radius: 2px 2px 0 0;

      .title {
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  .el-row {
    background-color: white;
    padding: 10px;
    margin: 0 0 10px 0;
  }

  .el-row:last-child{
    margin-bottom: 0;
  }

  .base_info::v-deep {
    height: 150px;

    .el-avatar {
      margin-top: 35px;
      width: 70px;
      height: 70px;
    }

    .little {
      font-size: 14px;
      color: gray;
    }

    .little span {
      width: 100px;
      display: inline-block;
    }

    .todo {
      font-size: 14px;
      margin: 15px 0;
    }

    .todo var {
      color: red;
      margin-right: 5px;
    }

    .right_col:nth-child(6) div {
      border: 2px solid rgb(89, 145, 183);
      border-top: thick solid rgb(89, 145, 183);
      color: rgb(89, 145, 183);
    }

    .right_col:nth-child(5) div {
      border: 2px solid rgb(141, 197, 53);
      border-top: thick solid rgb(141, 197, 53);
      color: rgb(141, 197, 53);
    }

    .right_col:nth-child(4) div {
      border: 2px solid rgb(225, 51, 73);
      border-top: thick solid rgb(225, 51, 73);
      color: rgb(225, 51, 73);
    }

    .right_col:nth-child(3) div {
      border: 2px solid rgb(247, 174, 79);
      border-top: thick solid rgb(247, 174, 79);
      color: rgb(247, 174, 79);
    }

    .right_col {
      div {
        padding: 30px;
        text-align: center;
        margin: 0 20px;
        height: 130px;

        span {
          display: block;
          font-size: 24px;
        }

        span:nth-child(2) {
          font-size: 14px;
          margin-top: 20px;
        }
      }
    }
  }

  .data_overview::v-deep {
    background-color: #F2F2F2;
    height: 330px;
    padding: 0;
    .el-col {
      background-color: white;
      /*border: 1px red solid;*/
    }
    .card:nth-child(1){
      margin-right: 5px;
    }
    .card:nth-child(2){
      margin-left: 5px;
    }
    .card .el-row.overview{
      height: 135px;
      margin: 0;
    }

    .today p {
      margin: 5px;
    }

    .today p:nth-child(1) {
      font-size: 14px;
    }

    .today p:nth-child(2) {
      font-size: 24px;
      margin: 12px 0 12px 0;
    }

    .today p:nth-child(3) {
      font-size: 14px;
    }

    .up {
      color: rgb(112, 182, 84);
    }

    .down {
      color: rgb(217, 0, 100);
    }

    .top5_btn_group {
      margin: 0;
      padding-bottom: 0;

      .el-button {
        width: 80px;
      }

      .el-button.active {
        color: #409EFF;
        border-color: #c6e2ff;
        background-color: #ecf5ff;
      }
    }
  }

  .line_chart{
    #chart{
      height:400px;
    }
  }
</style>
