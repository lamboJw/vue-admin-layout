import { MyObject } from '@/utils/myObject'

const common = {
  color: new MyObject({
    success: '#85ce61',
    warning: '#ebb563',
    danger: '#f78989',
    primary: '#409EFF',
    info: '#606266',
    normal: '#FFFFFF'
  }),
  pager: {
    page_name: 'page', // 页码键名
    page_size_name: 'prePage', // 每页数量键名
    default_page_size: 20, // 默认每页数量
    page_sizes: [10, 15, 20, 50, 100, 200] // 总共可选每页数量
  },
  admin_uid: '1',
  dataPermission: new MyObject({ 1: '所有数据', 2: '仅与自己相关数据', 3: '指定可见数据' }),
  position: new MyObject({ 1: '普通用户', 2: '部门主管', 3: '总经理' }),
  empty_return: new Promise(resolve => resolve({ code: 0, msg: '', result: {}}))
}

export { common }
