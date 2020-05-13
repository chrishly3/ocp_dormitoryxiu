<template>
  <d2-container>
    <!-- header 查询条件 -->
    <template slot="header">
      <el-form
              :inline="true"
              :model="listQuery"
              size="mini"
              style="margin-bottom: -18px;">
        <el-form-item label="用户名" prop="username">
          <el-input @keyup.enter.native="handleFilter" style="width: 200px;" placeholder="用户名" v-model="listQuery.username" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="default" @click="handleFilter" icon="el-icon-search">搜 索</el-button>
        </el-form-item>
        <el-form-item style="float: right">
          <el-button @click="handleCreate" type="primary" icon="el-icon-plus">新 增</el-button>
        </el-form-item>
      </el-form>
    </template>
    <!-- table表格 -->
    <el-table :key='tableKey'
              :data="list"
              v-loading="listLoading"
              element-loading-text="拼命加载中..."
              highlight-current-row
              stripe
              style="width: 100%">

      <el-table-column align="center" label="应用名称">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="手机号">
        <template slot-scope="scope">
          <span>{{scope.row.phone}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | parseTime('{y}-{m}-{d} {h}:{i}')}}</span>
        </template>
      </el-table-column>

      <el-table-column align="center" label="标签">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.roleId" type="success">{{scope.row.roleName}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否上架">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.enabled" @change=change(scope.row)>
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="是否VIP通道">
        <template slot-scope="scope">
          <el-switch active-color="#13ce66" inactive-color="#ff4949" v-model="scope.row.enabled" @change=change(scope.row)>
          </el-switch>
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" @click="handleUpdate(scope.row)" icon="el-icon-edit"></el-button>
          <el-button size="mini" type="danger" @click="deletes(scope.row)" icon="el-icon-delete"></el-button>
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
    <!-- 新增用户弹框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%" >
      <el-form :model="form" :rules="rules" ref="form" label-width="100px">
        <el-row>
          <el-col :span="24">
            <el-form-item label="用户名" prop="username">
              <el-input v-model="form.username" placeholder="请输用户名"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item v-if="dialogStatus == 'create'" label="密码" placeholder="请输入密码" prop="password">
              <el-input type="password" v-model="form.password"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号" prop="phone">
              <el-input v-model="form.phone" placeholder="验证码登录使用"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickname">
              <el-input v-model="form.nickname" placeholder="请输入用户昵称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入用户邮箱"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所属角色" prop="roleId">
              <el-select v-model="form.roleId" placeholder="请选择角色">
                <el-option
                        v-for="item in roleData"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel('form')" icon="el-icon-close">取 消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="create('form')" icon="el-icon-check">确 定</el-button>
        <el-button v-else type="primary" @click="update('form')" icon="el-icon-check">修 改</el-button>
      </div>
    </el-dialog>
  </d2-container>
</template>

<script>
import { fetchList, getObj, addObj, putObj, delObj, updateEnabled } from '@/api/user'
import { fetchAllList } from '@/api/role'
import ElOption from 'element-ui/packages/select/src/option'
export default {
  components: {
    ElOption
  },
  name: 'table_user',
  data () {
    return {
      roleData: {},
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
        username: undefined,
        password: undefined,
        enabled: undefined,
        phone: undefined,
        label: undefined
      },
      rules: {
        username: [
          {
            required: true,
            message: '请输入账户',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 20,
            message: '长度在 3 到 20 个字符',
            trigger: 'blur'
          },
          {
            trigger: 'blur',
            validator: (rule, value, callback) => {
              const reg = /^[a-zA-Z0-9]+$/
              if (!reg.test(value)) {
                callback(new Error('只能包含英文和数字'))
              } else {
                callback()
              }
            }
          }
        ],
        password: [
          {
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          },
          {
            min: 6,
            max: 20,
            message: '长度在 6 到 20 个字符',
            trigger: 'blur'
          }
        ],
        nickname: [
          {
            required: true,
            message: '请输入昵称',
            trigger: 'blur'
          },
          {
            min: 3,
            max: 6,
            message: '长度在 3 到 6 个字符',
            trigger: 'blur'
          }
        ],
        roleId: [
          {
            required: true,
            message: '请选择角色',
            trigger: 'blur'
          }
        ],
        phone: [
          {
            required: true,
            message: '手机号',
            trigger: 'blur'
          },
          {
            min: 11,
            max: 11,
            message: '长度在11 个字符',
            trigger: 'blur'
          }
        ]
      },
      statusOptions: ['true', 'false'],
      dialogFormVisible: false,
      dialogDeptVisible: false,
      userAdd: false,
      userUpd: false,
      userDel: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '新增用户'
      },
      isDisabled: {
        0: false,
        1: true
      },
      tableKey: 0
    }
  },
  filters: {
    statusFilter (status) {
      const statusMap = {
        true: '有效',
        false: '无效'
      }
      return statusMap[status]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    getList () {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.data
        this.total = response.data.count
      }).finally(() => {
        this.listLoading = false
      })
      fetchAllList().then(response => {
        this.roleData = response.data.data
      }).finally(() => {
        this.listLoading = false
      })
    },
    handleFilter () {
      this.listQuery.page = 1
      this.getList()
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
    handleDept () {
      fetchAllList().then(response => {
        this.roleData = response.data
        console.log(response.data)
      })
    },
    handleUpdate (row) {
      getObj(row.id).then(response => {
        this.form = response.data
        this.form.enabled = this.statusVal(this.form.enabled)
        this.form.roleId = row.roleId
        this.dialogFormVisible = true
        this.dialogStatus = 'update'
      })
    },
    change (row) {
      updateEnabled(row.id, row.enabled).then(({ data }) => {
        if (data.resp_code === 0) {
          this.getList()
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    statusVal (status) {
      if (status === true) {
        return '有效'
      } else if (status === false) {
        return '无效'
      } else {
        return ''
      }
    },
    create (formName) {
      const set = this.$refs
      set[formName].validate(valid => {
        if (valid) {
          addObj(this.form).then(({ data }) => {
            if (data.resp_code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            }
          })
            .finally(() => {
              this.dialogFormVisible = false
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
          this.form.password = undefined
          this.form.enabled = undefined
          putObj(this.form).then(({ data }) => {
            if (data.resp_code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '修改成功',
                type: 'success',
                duration: 2000
              })
            }
          })
            .finally(() => {
              this.dialogFormVisible = false
            })
        } else {
          return false
        }
      })
    },
    deletes (row) {
      this.$confirm(
        '此操作将永久删除该用户(用户名:' + row.username + '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        delObj(row.userId)
          .then(({ data }) => {
            if (data.resp_code === 0) {
              this.getList()
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            }
          })
          .finally(() => {
            this.dialogFormVisible = false
          })
      })
    },
    resetTemp () {
      this.form = {
        id: undefined,
        username: '',
        password: '',
        enabled: '',
        phone: ''
      }
    }
  }
}
</script>
