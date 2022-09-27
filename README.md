# vue-admin-layout

> 基于 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 开源项目，添加了一些布局模板，旨在通过配置来实现后台页面的显示，免去重复繁琐的组件填写。

## 基本使用方法
请在 [vue-admin-template](https://github.com/PanJiaChen/vue-admin-template) 中自行查看

## 配置修改
### 开发环境配置
1. 根据后端接口情况，修改`.env.development`中的`VUE_APP_BASE_API`参数。  
如果前后端分离，接口为：<u>http://www.sdk.com/backend/xxxxx </u>，那就填写 <u> http://www.sdk.com/backend/ </u>。  
如果直接使用后端域名打开前端index.html，也可以不填域名，只填<u> /backend/ </u>，打开之后所有接口就默认使用当前域名。
2. 前后端分离时，在开发环境下，可能会出现跨域问题，修改`vue.config.js`中 `devServer`配置。
3. 修改`src/utils/requerst.js`中的响应判断，根据后端接口返回的结构修改响应内容，也可以增加对code之类的响应码判断执行弹窗等操作。
4. 修改`src/layout/mixin/index_common.js`中`fetch_callback`方法，根据接口返回的结构，对应填入变量中。  
`this.total_count`：列表总数  
`this.list`：当前页列表数量
5. 修改请求列表的分页信息：`src/const/constant.js`中`pager`变量，修改`page_name`和`page_size_name`。

## 使用
### 数据表格
1. 复制`src/layout/index_template.vue`到对应目录，修改名称，实现几个方法，返回一个Promise，即刻实现对应操作：
    + `fetch_api()` 请求列表数据
    + `del_api(id)` 删除记录
    + `changeStatus(id, status)` 修改记录状态
2. 填写`form`对象，对应需要筛选的条件键名
3. 填写`form_item`数组，用于渲染筛选表单，每个数组元素为一个对象，对象元素包括：
    + `label`：表单项标签
    + `prop`：绑定form中的字段
    + `disabled`: true：设置禁用
    + `type`: 表单项类型
      + `input`：输入框。额外元素：
        + `input_type`：输入框类型，默认text，支持原生input类型及el-input类型
      + `select`：下拉选择框。额外元素：
        + `options`：下拉选项，如果要动态生成，需要在created或mounted中push进去；
        + `option_value`：下拉选项值，默认为id；
        + `option_label`：下拉选项标签，默认为name
      + `date`、`daterange`、`datetime`、`datetimerange`、`month`、`monthrange`、`year`：日期、日期时间、月份、年份选择框，与el-date-picker的type对应。
      + `time`、`timerange`：时间选择框，与。
      + `multi_select`：下拉多选框。额外元素：
        + `options`：下拉选项；
        + `option_value`：下拉选项值，默认为id；
        + `option_label`：下拉选项标签，默认为name
      + `number_scope`：数字范围输入框。额外元素：
        + `min`：最小值对应的key，默认min；
        + `max`：最大值对应的key，默认max；
        + `prop`：对应的数据必须是包含min和max的对象
      + `slot`：自定义插槽，绑定了当前item，添加`<template v-slot:slot_name="{item}">`填写插槽内容。额外元素：
        + `slot_name`：插槽名称
4. 填写`table_column`数组，用于渲染数据表格，每个数组元素为一个对象，对象元素包括：
   + `min_width`：设置最小宽度，默认100
   + `type`：设置单元格类型，
     + `selection`：多选框，开启多选框后，需要在`table-layout`组件上绑定事件`@selection-change="handle_table_selection_change"`，选中内容保存到`this.table_selection`中，默认获取选中的id，可以重写`handle_table_selection_change`方法实现更多操作
     + `index`：行索引
     + `expand`：展开按钮，需实现插槽`<template v-slot:table_expand="{row}"></template>`
   + `template`：单元格渲染特定模版：
     + `status_str`：显示状态文字，根据`status_options`对应本行的`status_key`的值
     + `status_select`：状态下拉修改，变更后会自动调用`change_status`方法
     + `img`：展示图片，点击放大
     + `input`：编辑框，额外元素：
       + `change`：修改编辑框内容时，触发的方法，传入参数有本行的`id_key`对应的值，以及修改后的内容
     + `icon`：展示系统图标
     + `html`：渲染HTML
     + `function`：渲染方法返回的值，额外元素：
       + `function`：要执行的方法，传入参数为当前行所有内容
     + `slot`：动态插槽，额外元素：
       + `slot_name`：插槽名称，需要实现`<template v-slot:slot_name="{scope}"></template>`
     + `action`：操作列专用，用于显示操作按钮，若按钮过多，或超过列宽，则会隐藏到按钮盒子中，额外元素：
       + `show_num`：要显示的按钮数，会根据列宽度自适应增加或减少，其他则收进弹窗中
       + `action`：对象数组，每个对象包含以下元素：
         + `type`: 按钮类型，对应el-button的type参数，默认text
         + `class`：按钮应用的样式类，选填
         + `color`：按钮颜色，如果使用text类型按钮，可以使用这个参数修改按钮字体颜色，默认primary的颜色
         + `size`：按钮大小，默认small
         + `click`：点击按钮执行的操作，例：`({row, column, $index, store}) => {this.open_dialog('edit', row.id)}`
         + `v-if`：用于判断按钮显示条件，返回bool值，例：`({row, column, $index, store}) => {return true}`
         + `v-permission`：用于权限判断
   + `event`：单元格操作：有以下取值：
     + `copy_text`：点击单元格复制单元格内容
5. 操作列action无法实现的，可以在`<template v-slot:other_tools={row}>`中实现
6. 有额外的按钮时，可以在`<template v-slot:button>`插槽中添加
7. 开启自定义列显示，在`table-layout`中添加`table-column-storage-name`参数，指定一个名称，当修改了显示列后，会把配置保存到localstorage中，下次打开自动读取配置
8. 显示批量删除按钮，在`table-layout`中添加`batch-del-btn=true`，且列表开启多选，如果按钮需要权限管理，再添加`batch-del-permission='权限名'`，然后实现`batch_del_api(selection)`方法，调用批量删除接口
9. 可在`table-layout`传入`table-params`对象，实现更多自定义表格属性

### 对话框
1. 复制`src/layout/dialog_template.vue`到对应目录，修改名称，实现几个方法，返回一个Promise，即刻实现对应操作：
  + `init_api()` 请求记录信息
  + `submit_api()` 提交表单
2. 填写`info`变量，把所有要提交的key都写上，init时，会根据info的key，来填入对应的数据
3. 打开对话框时，默认会执行init方法，如果要修改，可以在`dialog-layout`中`open`参数指定
4. 对话框标题，默认根据id是否为空，来判断是添加还是编辑，也可以自定义
5. 当对话框为嵌套对话框时，需要在`dialog-layout`中添加`append-to-body`
6. 对话框默认中间弹出，要全屏时，添加`fullscreen`，要从侧边滑出，添加`side-bar`
7. 可在`dialog-layout`传入`dialog-params`对象，实现更多自定义对话框属性

## 更多
以上文档只是写了大部分内容，更多细节可以查看源码