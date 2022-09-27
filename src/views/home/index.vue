<template>
  <div class="app-container">
    <el-row>
      <el-col class="name_info">
        <p class="admin_name">{{ user_name }}</p>
        <p class="role_name">{{ role_name }}</p>
      </el-col>
      <el-col class="login_info">
        <span>当前登录ip:</span>
        <span style="float: right;">{{ loginInfo.ip }}</span>
      </el-col>
      <el-col class="login_info">
        <span>登录位置:</span>
        <span style="float: right;">{{ loginInfo.address }}</span>
      </el-col>
    </el-row>
    <el-row v-if="role.includes(2)" class="data" type="flex" justify="space-around">
      <el-col class="data_block" :span="6">
        <el-row class="header_row">
          <el-col class="title">
            收入
          </el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="big_text" :span="12">今日：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.today_pay }}</el-col>
          <el-col class="big_text" :span="12">昨日：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.yesterday_pay }}</el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="small_text" :span="12">本周：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.week_pay }}</el-col>
          <el-col class="small_text" :span="12">上周：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.last_week_pay }}</el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="small_text" :span="12">本月：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.month_pay }}</el-col>
          <el-col class="small_text" :span="12">上月：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.last_month_pay }}</el-col>
        </el-row>
      </el-col>
      <el-col class="data_block" :span="6">
        <el-row class="header_row">
          <el-col class="title">
            新增
          </el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="big_text" :span="12">今日：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.today_newreg }}</el-col>
          <el-col class="big_text" :span="12">昨日：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.yesterday_newreg }}</el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="small_text" :span="12">本周：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.week_newreg }}</el-col>
          <el-col class="small_text" :span="12">上周：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.last_week_newreg }}</el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="small_text" :span="12">本月：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.month_newreg }}</el-col>
          <el-col class="small_text" :span="12">上月：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.last_month_newreg }}</el-col>
        </el-row>
      </el-col>
      <el-col class="data_block" :span="6">
        <el-row class="header_row">
          <el-col class="title">
            活跃
          </el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="big_text" :span="12">今日：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.today_loginuid }}</el-col>
          <el-col class="big_text" :span="12">昨日：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.yesterday_loginuid }}</el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="small_text" :span="12">本周：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.week_loginuid }}</el-col>
          <el-col class="small_text" :span="12">上周：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.last_week_loginuid }}</el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="small_text" :span="12">本月：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.month_loginuid }}</el-col>
          <el-col class="small_text" :span="12">上月：</el-col>
          <el-col class="small_text" :span="12">{{ plat_data.last_month_loginuid }}</el-col>
        </el-row>
      </el-col>
      <el-col class="data_block" :span="6">
        <el-row class="header_row">
          <el-col class="title">
            累计
          </el-col>
        </el-row>
        <el-row class="body_row">
          <el-col class="big_text" :span="12">累计用户：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.total_user }}</el-col>
          <el-col class="big_text" :span="12">付费用户：</el-col>
          <el-col class="big_text" :span="12">{{ plat_data.total_payuser }}</el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <div id="chart" style="height: 350px;" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getHomeInfo } from '@/api/home'
import * as echarts from 'echarts'
export default {
  name: 'Index',
  data() {
    return {
      user_name: '',
      role_name: '',
      loginInfo: {
        ip: '',
        address: ''
      },
      role: [],
      plat_data: {
        today_pay: 0,
        yesterday_pay: 0,
        week_pay: 0,
        last_week_pay: 0,
        month_pay: 0,
        last_month_pay: 0,
        today_newreg: 0,
        yesterday_newreg: 0,
        week_newreg: 0,
        last_week_newreg: 0,
        month_newreg: 0,
        last_month_newreg: 0,
        today_loginuid: 0,
        yesterday_loginuid: 0,
        week_loginuid: 0,
        last_week_loginuid: 0,
        month_loginuid: 0,
        last_month_loginuid: 0,
        total_payuser: 0,
        total_user: 0,
        today_chart: [],
        yesterday_chart: []
      },
      line_chart_option: {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['昨天', '今天']
        },
        xAxis: {
          type: 'category',
          data: ['0:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00', '23:00']
        },
        yAxis: {
          type: 'value'
        },
        series: [
          { name: '昨天', type: 'line', data: [] },
          { name: '今天', type: 'line', data: [] }
        ]
      }
    }
  },
  mounted() {
    getHomeInfo().then(result => {
      for (const i in result) {
        if (i === 'plat_data') {
          this.line_chart_option.series[0].data = result[i].yesterday_chart.split(',')
          this.line_chart_option.series[1].data = result[i].today_chart.split(',')
        }
        this.$data[i] = result[i]
      }
      const line_chart = echarts.init(document.getElementById('chart'))
      line_chart.setOption(this.line_chart_option)
    }).catch(err => { console.log(err.message) })
  }
}
</script>

<style lang="scss" scoped>
  .app-container::v-deep {
    background-color: #F2F2F2;
    padding: 10px 0;
    .el-row{
      background-color: white;
      padding: 10px;
      margin: 0 0 10px 0;
    }
    .header_row {
      position: relative;
      height: 48px;
      line-height: 45px;
      padding: 0 15px;
      border-bottom: 1px solid rgb(236, 236, 236);
      color: rgb(51, 51, 51);
      border-radius: 2px 2px 0 0;
      .title {
        font-size: 20px;
        font-weight: bold;
      }
    }
    .name_info{
      height: 130px;
      text-align: center;
      border-bottom: 1px solid rgb(236, 236, 236);
      border-radius: 2px 2px 0 0;
      .admin_name{
        font-size: 2.3em;
        color: #2d8cf0;
        margin-bottom: 0;
      }
      .role_name{
        margin-top: 5px;
        font-size: 1em;
        color: #999;
      }
    }

    .login_info{
      padding: 5px 10px;
      font-size: 1em;
    }

    .data{
      .data_block{
        border-right: 1px solid rgb(236, 236, 236);
        border-radius: 2px 2px 0 0;
      }
      .body_row{
        padding-left: 15px;
        padding-bottom: 0;
        font-style: italic;
        .big_text{
          font-size: 26px;
          margin-bottom: 5px;
        }
        .small_text{
          font-size: 14px;
          margin-bottom: 5px;
        }
      }
    }
  }
</style>
