<template>
    <div class="aooms-dialog">
        <el-dialog
                title="权限分配"
                :visible.sync="dialogVisible">

            <el-form ref="form" :model="form" label-width="5px" size="small">
                <input type="hidden" v-model="form.id">
                <el-row style="padding: 0 0 5px 5px;font-weight: bold;">
                    当前角色：{{ form.name }}
                </el-row>

                <el-form-item>
                    <el-input size="mini" placeholder="输入关键字进行过滤" v-model="filterText" style="padding-bottom: 5px;"></el-input>
                    <div style="height: 300px;">
                        <el-scrollbar style="height:100%" class="aooms-scrollbar">
                            <el-tree
                                    ref="tree"
                                    show-checkbox
                                    :expand-on-click-node="false"
                                    :props="{
                                        label: 'name'
                                    }"
                                    highlight-current
                                    node-key="id"
                                    :data="permissionData"
                                    :filter-node-method="filterNode">

                                <span class="aooms-tree-node" slot-scope="{ node, data }">
                                   <d2-icon :name="data.css" style="width: 15px;text-align: center;"/>&nbsp;{{ node.label }}
                                </span>

                            </el-tree>
                        </el-scrollbar>
                    </div>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" :loading="loading" @click="insert">保存</el-button>
                    <el-button @click="close">取消</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
    </div>

</template>

<script>
import { rolesPermission, menusPermission, findPermissionByRoleId } from '@/api/role'

export default {
  props: {
    id: {},
    name: {},
    treeData: {}
  },
  data () {
    return {
      loading: false,
      form: {},
      dialogVisible: false,
      filterText: '',
      resourceIds: [],
      selectResourceIds: [],
      halfSelectResourceIds: [],
      permissionData: []
    }
  },
  watch: {
    form (val) {
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    var self = this
    menusPermission().then(res => {
      self.permissionData = res.data
    })
  },
  methods: {
    insert: function () {
      var self = this
      this.$refs.form.validate((valid, error) => {
        if (valid) {
          var nodes = this.$refs.tree.getCheckedNodes()
          var halfNodes = this.$refs.tree.getHalfCheckedNodes()
          this.selectResourceIds = []
          this.halfSelectResourceIds = []
          nodes.forEach(node => {
            this.selectResourceIds.push(node.id)
          })
          halfNodes.forEach(node => {
            this.halfSelectResourceIds.push(node.id)
          })

          let submitData = new FormData()
          submitData.append('roleId', self.form.id)
          submitData.append('resourceIds', self.selectResourceIds)
          submitData.append('halfResourceIds', self.halfSelectResourceIds)

          this.loading = true
          rolesPermission(submitData).then(({ data }) => {
            if (data.resp_code === 0) {
              this.loading = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
            this.close()
          })
        }
      })
    },
    open: function (row) {
      this.dialogVisible = true
      this.form = Object.assign({}, row)
      var self = this
      this.$nextTick(() => {
        self.$refs.tree.setCheckedNodes([])
        findPermissionByRoleId(self.form.id).then(response => {
          if (response.data.datas) {
            self.resourceIds = response.data.datas
            self.$refs.tree.setCheckedNodes(self.resourceIds)
          };
        }).finally(() => {
        })
      })
    },
    close: function () {
      this.dialogVisible = false
    },
    filterNode (value, data) {
      if (!value) return true
      return data.name.indexOf(value) !== -1
    }
  }
}
</script>
