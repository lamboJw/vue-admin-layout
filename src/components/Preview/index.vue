<template>
  <div>
    <el-dialog
      v-loading.fullscreen.lock="loading"
      title="预览"
      :visible.sync="viewVisible"
      :element-loading-text="loading_text"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      fullscreen
      class="abow_dialog"
      @close="$emit('close')"
    >
      <template v-if="fileType === 'pdf'">
        <vue-office-pdf :src="src" @rendered="rendered" @error="error" />
      </template>
      <template v-if="fileType === 'xlsx'">
        <div id="luckysheet" style="margin:0;padding:0;width:100%;height:100%;" />
      </template>
      <template v-if="fileType === 'docx'">
        <vue-office-docx :src="src" @rendered="rendered" @error="error" />
      </template>
      <span slot="footer" style="position: absolute; top: 95%; clear: both; right: 3%; z-index: 9">
        <el-button @click="$emit('close')">取消</el-button>
        <el-button v-if="fileType === 'pdf'" v-permission="'agreement-print'" type="primary" @click="printPage">打印</el-button>
      </span>
    </el-dialog>
    <el-image-viewer v-if="fileType === 'img'" :url-list="[src]" :on-close="() => {$emit('close')}" />
  </div>
</template>

<script>
import { previewDoc } from '@/api/common'
import Vue from 'vue'
import ElImageViewer from 'element-ui/packages/image/src/image-viewer'
import '@vue-office/excel/lib/index.css'
import VueOfficeDocx from '@vue-office/docx'
import '@vue-office/docx/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'
import LuckyExcel from 'luckyexcel'
import { loadCss, loadJs } from '@/utils/common_function'
import axios from 'axios'

export default {
  name: 'Preview',
  components: {
    ElImageViewer,
    VueOfficeDocx,
    VueOfficePdf
  },
  props: {
    filesrc: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      viewVisible: false,
      src: this.encodeUrl(this.filesrc),
      fileType: '',
      loading: false,
      loading_text: ''
    }
  },
  created() {
    this.browseOnline()
  },
  methods: {
    encodeUrl(src) {
      const arr = src.split('/')
      arr[arr.length - 1] = encodeURIComponent(arr[arr.length - 1])
      return arr.join('/')
    },
    browseOnline() {
      if (/\.(pdf|PDF)$/.test(this.filesrc)) {
        this.fileType = 'pdf'
        this.loading_text = '正在加载pdf文件...'
        this.loading = true
        this.viewVisible = true
      } else if (/\.docx$/.test(this.filesrc)) {
        this.fileType = 'docx'
        this.loading_text = '正在加载word文件...'
        this.loading = true
        this.viewVisible = true
      } else if (/\.doc$/.test(this.filesrc)) {
        this.loading_text = '正在转换word文档...'
        this.loading = true
        previewDoc(this.filesrc.replace(Vue.prototype.BASE_URL, '')).then(
          (res) => {
            this.fileType = 'pdf'
            this.src = Vue.prototype.BASE_URL + this.encodeUrl(res.result.pdf_path)
          }
        )
        this.viewVisible = true
      } else if (/\.(png|jpg|jpeg|bmp|gif|svg$)/.test(this.filesrc)) {
        this.fileType = 'img'
      } else if (/\.xlsx$/.test(this.filesrc)) {
        this.fileType = 'xlsx'
        this.loading_text = '正在加载excel文件...'
        this.loading = true
        if (typeof window.luckysheet === 'undefined') {
          Promise.all([
            loadCss('./luckysheet/plugins/css/pluginsCss.css'),
            loadCss('./luckysheet/plugins/plugins.css'),
            loadCss('./luckysheet/css/luckysheet.css'),
            loadCss('./luckysheet/assets/iconfont/iconfont.css'),
            loadJs('./luckysheet/plugins/js/plugin.js'),
            loadJs('./luckysheet/luckysheet.umd.js')
          ]).then(() => {
            this.loadExcel()
          })
        } else {
          this.loadExcel()
        }
      } else {
        // 不是pdf格式 使用微软提供的Office Online实现
        // window.open("https://view.officeapps.live.com/op/view.aspx?src=" + this.filesrc, '_blank');
        // 直接下载
        this.$emit('download_callback')
        window.open(this.src, '_blank')
        this.$emit('close')
      }
    },
    printPage() {
      this.$emit('print_page_callback')
      window.open(this.src, '_blank')
      /* const bodyHtml = window.document.body.innerHTML;
        // 获取要打印的dom
        const printContentHtml = document.getElementById("print").innerHTML;
        // 替换页面内容
        window.document.body.innerHTML = printContentHtml;
        // 全局打印
        window.print();
        // 还原页面内容
        window.document.body.innerHTML = bodyHtml;*/
    },
    rendered() {
      this.loading = false
    },
    error(e) {
      this.$message.error(e)
      this.viewVisible = false
      this.loading = false
    },
    loadExcel() {
      axios
        .get(this.src, { responseType: 'arraybuffer' })
        .then((res) => {
          this.viewVisible = true
          LuckyExcel.transformExcelToLucky(res.data, (exportJson) => {
            if (exportJson.sheets == null || exportJson.sheets.length === 0) {
              this.loading = false
              this.viewVisible = false
              this.$message.error('加载excel文件失败')
              return
            }
            exportJson.sheets.forEach((sheet, index) => {
              const new_cell_data = []
              sheet.celldata.forEach((cell) => {
                if (cell.c <= 99 && cell.r <= 4999) {
                  if (typeof cell.v.ct !== 'undefined' && typeof cell.v.ct.fa !== 'undefined' && /###,##0\.00/.test(cell.v.ct.fa)) {
                    cell.v.ct.fa = '###,###.00'
                  }
                  new_cell_data.push(cell)
                }
              })
              exportJson.sheets[index].celldata = new_cell_data
            })
            // 销毁原来的表格
            window.luckysheet.destroy()
            // 重新创建新表格
            window.luckysheet.create({
              container: 'luckysheet', // 设定DOM容器的id
              showtoolbar: false, // 是否显示工具栏
              showinfobar: false, // 是否显示顶部信息栏
              showstatisticBar: false, // 是否显示底部计数栏
              sheetBottomConfig: false, // sheet页下方的添加行按钮和回到顶部按钮配置
              allowEdit: false, // 是否允许前台编辑
              enableAddRow: false, // 是否允许增加行
              enableAddCol: false, // 是否允许增加列
              sheetFormulaBar: false, // 是否显示公式栏
              enableAddBackTop: false, // 返回头部按钮
              data: exportJson.sheets, // 表格内容
              title: exportJson.info.name // 表格标题
            })
            this.loading = false
          })
        })
        .catch(() => {
          this.loading = false
          this.viewVisible = false
          this.$message.error('加载excel文件失败')
        })
    }
  }
}
</script>
<style>
.abow_dialog {
  display: flex;
  justify-content: center;
  align-items: Center;
  overflow: hidden;
}
.abow_dialog .el-dialog {
  margin: 0 auto !important;
  /*height: 90%;*/
  overflow: hidden;
}
.abow_dialog .el-dialog__body {
  position: absolute;
  left: 0;
  top: 54px;
  bottom: 0;
  right: 0;
  padding: 0;
  z-index: 1;
  overflow: hidden;
  overflow-y: auto;
  height: 87%;
}
</style>
