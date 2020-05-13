<template>
<d2-container>
  <!-- header 查询条件 -->
  <template slot="header">
    <el-form
      :inline="true"
      :model="listQuery"
      size="mini"
      style="margin-bottom: -18px;">
        <el-form-item label="角色名" prop="roleName">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="角色名" v-model="listQuery.roleName" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button style="float: right" @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
        </el-form-item>
    </el-form>
  </template>
  <el-table
        :key='tableKey'
        :data="list"
        v-loading="listLoading"
        element-loading-text="拼命加载中..."
        highlight-current-row
        stripe
        style="width: 100%">

    <el-table-column align="center" label="序号" width="60">
      <template slot-scope="scope">
        <span>{{scope.row.id}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="角色名称">
      <template slot-scope="scope">
        <span>{{scope.row.name}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="角色标识">
      <template slot-scope="scope">
        <span>{{scope.row.code}}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="角色描述">
      <template slot-scope="scope">
        <span>{{scope.row.desc }}</span>
      </template>
    </el-table-column>

    <el-table-column align="center" label="创建时间">
      <template slot-scope="scope">
        <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
      </template>
    </el-table-column>

    <el-table-column label="操作" width="320" fixed="right">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
        <el-button size="mini" type="success" @click="handleResourceAssign(scope.row)">菜单</el-button>
        <el-button size="mini" type="warning" @click="handlePermission(scope.row)">权限</el-button>
        <el-button size="mini" type="danger" @click="handleDelete(scope.row)" icon="el-icon-delete"></el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- footer 分页条 -->
  <template slot="footer">
    <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="listQuery.page"
            :page-sizes="[10,20,30,50]"
            :page-size="listQuery.limit"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            style="margin: -10px;">
    </el-pagination>
  </template>
  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="400px">
    <el-form :model="form" :rules="rules" ref="form" label-width="100px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.name" placeholder="角色名称"></el-input>
      </el-form-item>
      <el-form-item label="角色标识" prop="code">
        <el-input v-model="form.code" placeholder="角色标识"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="desc">
        <el-input v-model="form.desc" placeholder="描述"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel('form')" icon="el-icon-close">取 消</el-button>
      <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check">确 定</el-button>
      <el-button v-else type="primary" @click="update('form')" icon="el-icon-check">修 改</el-button>
    </div>
  </el-dialog>

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogDeptVisible" width="600px">
    <el-tree class="filter-tree" :data="treeDeptData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current ref="deptTree" @node-click="getNodeData" :props="defaultProps" :filter-node-method="filterNode" default-expand-all>
    </el-tree>
  </el-dialog>

  <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogPermissionVisible" width="800px" top="20px">
    <el-tree class="filter-tree" :data="treeData" :default-checked-keys="checkedKeys" check-strictly node-key="id" highlight-current :props="defaultProps" show-checkbox ref="menuTree" :filter-node-method="filterNode">
    </el-tree>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="updateRoleMenu(roleId, roleCode)" icon="el-icon-check">授 权</el-button>
    </div>
  </el-dialog>

  <!-- 权限分配窗口 -->
  <resource-assign
          :treeData="treeData"
          ref="resourceAssign">
  </resource-assign>

  <permission
          :treeData="treeData"
          ref="permission">
  </permission>
</d2-container>
</template>

<script>
import {
  fetchAllList,
  getObj,
  addObj,
  delObj
} from '@/api/role'
import ResourceAssign from './ResourceAssign.vue'
import Permission from './Permission.vue'

export default {
  name: 'table_role',
  components: {
    ResourceAssign,
    Permission
  },
  data () {
    return {
      treeData: [],
      treeDeptData: [],
      checkedKeys: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      list: null,
      total: null,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10
      },
      form: {
        name: undefined,
        code: undefined,
        desc: undefined
      },
      roleId: undefined,
      roleCode: undefined,
      rules: {
        name: [
          {
            required: true,
            message: '角色名称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        code: [
          {
            required: true,
            message: '角色标识',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ],
        desc: [
          {
            required: true,
            message: '角色标识',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: ['0', '1'],
      rolesOptions: undefined,
      dialogFormVisible: false,
      dialogDeptVisible: false,
      dialogPermissionVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '创建',
        roleMenu: '菜单授权'
      },
      tableKey: 0,
      roleManager_btn_add: false,
      roleManager_btn_edit: false,
      roleManager_btn_del: false,
      roleManager_btn_perm: false
    }
  },
  created () {
    this.getList()
  },
  methods: {
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
    },
    getList () {
      this.listLoading = true
      fetchAllList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.current
        this.listLoading = false
      })
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.getList()
    },
    handleCurrentChange (val) {
      this.listQuery.page = val
      this.getList()
    },
    handleCreate () {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response.data.datas
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    handleResourceAssign: function (row) {
      this.$refs.resourceAssign.open(row)
    },
    handlePermission: function (row) {
      this.$refs.permission.open(row)
    },
    filterNode (value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    getNodeData (data) {
      this.dialogDeptVisible = false
    },
    handleDelete (row) {
      this.$confirm(
        '此操作将永久删除该角色(角色名:' + row.name + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delObj(row.id).then(response => {
          if (response.data.resp_code === 0) {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '成功',
              message: '删除成功',
              type: 'success',
              duration: 2000
            })
          } else {
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: '失败',
              message: response.data.resp_msg,
              type: 'error',
              duration: 2000
            })
          }
        })
      })
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(({ data }) => {
            if (data.resp_code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        } else {
          return false
        }
      })
    },
    cancel (formName) {
      this.dialogFormVisible = false
      this.$refs[formName].resetFields()
    },
    update (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          this.dialogFormVisible = false
          addObj(this.form).then(({ data }) => {
            if (data.resp_code === 0) {
              this.getList()
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
          })
        } else {
          return false
        }
      })
    },
    resetTemp () {
      this.form = {
        id: undefined,
        name: undefined,
        code: undefined,
        desc: undefined
      }
    },
    handleUserSet (row) {
      this.$refs.roleMemberSet.init(row.roleId)
    },
    handlePermissionSet (row) {
      this.$refs.rolePermissionSet.init(row.roleId)
    }
  }
}
</script>
