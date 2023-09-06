<template>
  <div class="data-permission" :style="{ 'max-height': '50vh', overflow: 'auto' }">
    <el-divider content-position="left">角色数据权限设置</el-divider>
    <el-card v-for="item in list_layout" :key="item.title">
      <div slot="header">
        <span>{{ item.title }}</span>
      </div>
      <template v-if="item.hasKey('key')">
        <el-form :model="data_permission[item.key]" label-width="100px" inline>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据权限" required>
                <el-select v-model="data_permission[item.key].data_permission">
                  <el-option
                    v-for="(val, index) in data_permission_list(item)"
                    :key="index"
                    :value="parseInt(index)"
                    :label="val"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col v-if="show_extra_option(item, 'parent_game')" :span="12">
              <el-form-item label="一级游戏" required>
                <multi-select-new
                  :value.sync="data_permission[item.key].parent_game"
                  :options="parentGameList"
                  collapse-tags
                  filterable
                />
              </el-form-item>
            </el-col>
            <el-col v-if="show_extra_option(item, 'department')" :span="12">
              <el-form-item label="部门选择">
                <el-cascader
                  v-model="data_permission[item.key].department"
                  :options="departmentList"
                  :props="{ multiple: true, checkStrictly: true }"
                  collapse-tags
                  clearable
                  filterable
                />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </template>
      <template>
        <el-card v-for="child_item in item.children" :key="child_item.title">
          <div slot="header">
            <span>{{ child_item.title }}</span>
          </div>
          <el-form :model="data_permission[child_item.key]" label-width="100px" inline>
            <el-row>
              <el-col :span="12">
                <el-form-item label="数据权限" required>
                  <el-select v-model="data_permission[child_item.key].data_permission">
                    <el-option
                      v-for="(val, index) in data_permission_list(child_item)"
                      :key="index"
                      :value="parseInt(index)"
                      :label="val"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col v-if="show_extra_option(child_item, 'parent_game')" :span="12">
                <el-form-item label="一级游戏" required>
                  <multi-select-new
                    :value.sync="data_permission[child_item.key].parent_game"
                    :options="parentGameList"
                    collapse-tags
                    filterable
                  />
                </el-form-item>
              </el-col>
              <el-col v-if="show_extra_option(child_item, 'department')" :span="12">
                <el-form-item label="部门选择">
                  <el-cascader
                    v-model="data_permission[child_item.key].department"
                    :options="departmentList"
                    :props="{ multiple: true, checkStrictly: true }"
                    collapse-tags
                    clearable
                    filterable
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </el-card>
      </template>
    </el-card>
  </div>
</template>

<script>
import MultiSelectNew from '@/components/MultiSelectNew'
import { MyArray } from '@/utils/myArray'
import { common } from '@/const/constant'

export default {
  name: 'DataPermission',
  components: {
    MultiSelectNew
  },

  props: {
    parentGameList: {
      type: Array,
      default: function() {
        return []
      }
    },
    dataPermission: {
      type: Object,
      default: function() {
        return {}
      }
    },
    departmentList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      list_layout: new MyArray([
        {
          title: '玩家管理',
          children: [
            { title: '玩家列表', key: 'role_list', extra_options: ['parent_game'] },
            { title: '充值玩家配置', key: 'role_status', extra_options: ['parent_game'] }
          ]
        },
        {
          title: '文件盒子',
          key: 'file_box',
          extra_options: []
        }
      ]),
      default_data_permission: {
        role_list: {
          data_permission: 2,
          parent_game: []
        },
        role_status: {
          data_permission: 2,
          parent_game: []
        },
        file_box: {
          data_permission: 2
        }
      }
    }
  },
  computed: {
    data_permission: function() {
      if (Object.keys(this.dataPermission).length > 0) {
        if (Object.keys(this.default_data_permission).length === Object.keys(this.dataPermission).length) {
          // 新增完之前未有的权限后，返回dataPermission，防止死循环
          return this.dataPermission
        }
        const list = JSON.parse(JSON.stringify(this.dataPermission))
        const exists_keys = Object.keys(list)
        for (const key in this.default_data_permission) {
          if (!exists_keys.includes(key)) {
            // 如果存在新添加的权限，则添加到原数据中
            list[key] = JSON.parse(JSON.stringify(this.default_data_permission[key]))
          }
        }
        // 返回的是一个新的对象，对于watch来说，是改变了数据的，因此会触发watch的update
        return list
      } else {
        return JSON.parse(JSON.stringify(this.default_data_permission))
      }
    }
  },
  watch: {
    data_permission: {
      handler: function(val) {
        this.$emit('update:dataPermission', val)
      },
      deep: true
    }
  },
  methods: {
    data_permission_list(item) {
      const list = common.dataPermission.clone()
      if (item.extra_options.length === 0) {
        delete list[3]
      }
      if (item.hasKey('data_permission')) {
        for (const i in list) {
          const index = parseInt(i)
          if (!item.data_permission.includes(index)) {
            delete list[index]
          }
        }
      }
      return list
    },
    show_extra_option(item, key) {
      return (
        item.extra_options.includes(key) &&
        (this.data_permission[item.key].data_permission === 3 ||
          (item.hasKey('always_show') && item.always_show.includes(key)))
      )
    }
  }
}
</script>

<style scoped>
.el-select,
.el-cascader {
  width: 250px;
}

.el-card {
  margin-bottom: 20px;
}
</style>
